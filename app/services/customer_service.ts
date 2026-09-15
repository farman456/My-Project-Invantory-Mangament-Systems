import db from '@adonisjs/lucid/services/db'
import { applyListQuery } from '#helpers/list_query_helper'
import Customer from '#models/customer'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createCustomerValidatorInterface,
  updateCustomerPatchValidatorInterface,
  updateCustomerValidatorInterface,
} from '#validators/customer_validator'

export const listCustomers = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(db.from('customers'), options, {
      searchColumns: ['persons.name', 'persons.contact_person', 'persons.email'],
      sortColumns: {
        id: 'customers.id',
        name: 'persons.name',
        contactPerson: 'persons.contact_person',
        phone: 'persons.phone',
        email: 'persons.email',
        areaCity: 'persons.area_city',
        status: 'persons.status',
      },
    })

    if (options.status !== undefined) {
      query.where('persons.status', options.status)
    }

    const paginator = await query
      .join('persons', 'persons.id', 'customers.person_id')
      .select(
        'customers.id',
        'customers.person_id as personId',
        'persons.name',
        'persons.contact_person as contactPerson',
        'persons.phone',
        'persons.email',
        'persons.area_city as areaCity',
        'persons.status',
        'persons.actions'
      )
      .paginate(page, perPage)

    return {
      items: paginator.all(),
      pagination: {
        total: paginator.total,
        perPage: paginator.perPage,
        currentPage: paginator.currentPage,
        lastPage: paginator.lastPage,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving customers: ${message}`)
  }
}

export const createCustomer = async (payload: createCustomerValidatorInterface) => {
  const transaction = await db.transaction()

  try {
    const [personId] = await transaction.table('persons').insert({
      name: payload.name,
      contact_person: payload.contactPerson,
      phone: payload.phone,
      email: payload.email,
      area_city: payload.areaCity,
      status: payload.status,
      actions: payload.actions,
    })

    const [customerId] = await transaction.table('customers').insert({
      person_id: personId,
    })

    await transaction.commit()

    return {
      id: customerId,
      personId,
      ...payload,
    }
  } catch (error) {
    await transaction.rollback()

    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating customer: ${message}`)
  }
}

export const getCustomer = async (customerId: number) => {
  try {
    const customer = await db
      .from('customers')
      .join('persons', 'persons.id', 'customers.person_id')
      .select(
        'customers.id',
        'customers.person_id as personId',
        'persons.name',
        'persons.contact_person as contactPerson',
        'persons.phone',
        'persons.email',
        'persons.area_city as areaCity',
        'persons.status',
        'persons.actions'
      )
      .where('customers.id', customerId)
      .first()

    if (!customer) {
      throw new Error(`Customer with ID: ${customerId} does not exist`)
    }

    return customer
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving customer: ${message}`)
  }
}

export const updateCustomer = async (
  payload: updateCustomerValidatorInterface | updateCustomerPatchValidatorInterface,
  customerId: number
) => {
  const transaction = await db.transaction()

  try {
    const customer = await Customer.find(customerId)

    if (!customer) {
      throw new Error(`Customer with ID: ${customerId} does not exist`)
    }

    if (!customer.personId) {
      throw new Error(`Customer with ID: ${customerId} has no person record`)
    }

    const data: Record<string, unknown> = {}

    if (payload.name !== undefined) data.name = payload.name
    if (payload.contactPerson !== undefined) data.contact_person = payload.contactPerson
    if (payload.phone !== undefined) data.phone = payload.phone
    if (payload.email !== undefined) data.email = payload.email
    if (payload.areaCity !== undefined) data.area_city = payload.areaCity
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions

    await transaction.from('persons').where('id', customer.personId).update(data)

    await transaction.commit()

    return {
      id: customer.id,
      personId: customer.personId,
      ...payload,
    }
  } catch (error) {
    await transaction.rollback()

    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating customer: ${message}`)
  }
}

export const deleteCustomer = async (customerId: number) => {
  const transaction = await db.transaction()

  try {
    const customer = await Customer.find(customerId)

    if (!customer) {
      throw new Error(`Customer with ID: ${customerId} does not exist`)
    }

    if (!customer.personId) {
      throw new Error(`Customer with ID: ${customerId} has no person record`)
    }

    await transaction.from('customers').where('id', customerId).delete()
    await transaction.from('persons').where('id', customer.personId).delete()

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()

    const databaseError = error as { code?: string; errno?: number }

    const message =
      databaseError.code === 'ER_ROW_IS_REFERENCED_2' || databaseError.errno === 1451
        ? 'Customer cannot be deleted while related records exist'
        : error instanceof Error
          ? error.message
          : String(error)

    const deletionError = new Error(`Error deleting customer: ${message}`) as Error & { code?: string }
    if (databaseError.code === 'ER_ROW_IS_REFERENCED_2' || databaseError.errno === 1451) {
      deletionError.code = 'E_CUSTOMER_REFERENCED'
    }
    throw deletionError
  }
}