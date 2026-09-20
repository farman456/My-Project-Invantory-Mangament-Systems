import Supplier from '#models/supplier'
import {
  createSupplierValidatorInterface,
  updateSupplierPatchValidatorInterface,
  updateSupplierValidatorInterface,
} from '#validators/supplier_validator'
import db from '@adonisjs/lucid/services/db'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import { personConfigurationSelect, toPersonData } from '#helpers/person_fields'

export const listSuppliers = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(Supplier.query(), options, {
      searchColumns: ['persons.name', 'persons.contact_person', 'persons.email'],
      sortColumns: { id: 'suppliers.id', name: 'persons.name', status: 'persons.status' },
    })
    if (options.status !== undefined) query.where('persons.status', options.status)
    const paginator = await query
      .join('persons', 'persons.id', 'suppliers.person_id')
      .select(
        'suppliers.id',
        'persons.name',
        'persons.contact_person',
        'persons.phone',
        'persons.email',
        'persons.area_city',
        'persons.status',
        'persons.actions',
        ...personConfigurationSelect
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
    throw new Error(`Error retrieving suppliers: ${message}`)
  }
}

export const createSupplier = async (payload: createSupplierValidatorInterface) => {
  const transaction = await db.transaction()

  try {
    const [personResult] = await transaction.table('persons').insert(toPersonData(payload)).returning('id')

    const personId = personResult.id

    const [supplierResult] = await transaction.table('suppliers').insert({
      person_id: personId,
    }).returning('id')

    const supplierId = supplierResult.id

    await transaction.commit()

    return { id: supplierId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating supplier: ${message}`)
  }
}

export const getSupplier = async (supplierId: number) => {
  try {
    const supplier = await Supplier.query()
      .join('persons', 'persons.id', 'suppliers.person_id')
      .select(
        'suppliers.id',
        'persons.name',
        'persons.contact_person',
        'persons.phone',
        'persons.email',
        'persons.area_city',
        'persons.status',
        'persons.actions',
        ...personConfigurationSelect
      )
      .where('suppliers.id', supplierId)
      .first()

    if (!supplier) {
      throw new Error(`Supplier with ID: ${supplierId} does not exist`)
    }

    return supplier
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving supplier: ${message}`)
  }
}

export const updateSupplier = async (
  payload: updateSupplierValidatorInterface | updateSupplierPatchValidatorInterface,
  supplierId: number
) => {
  const transaction = await db.transaction()

  try {
    const supplier = await Supplier.find(supplierId)
    if (!supplier) {
      throw new Error(`Supplier with ID: ${supplierId} does not exist`)
    }
    if (!supplier.personId) {
      throw new Error(`Supplier with ID: ${supplierId} has no person record`)
    }

    const data: Record<string, unknown> = {}
    Object.assign(data, toPersonData(payload))

    await transaction.from('persons').where('id', supplier.personId).update(data)
    await transaction.commit()

    return { id: supplier.id, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating supplier: ${message}`)
  }
}

export const deleteSupplier = async (supplierId: number) => {
  const transaction = await db.transaction()

  try {
    const supplier = await Supplier.find(supplierId)
    if (!supplier) {
      throw new Error(`Supplier with ID: ${supplierId} does not exist`)
    }
    if (!supplier.personId) {
      throw new Error(`Supplier with ID: ${supplierId} has no person record`)
    }

    await transaction.from('suppliers').where('id', supplierId).delete()
    await transaction.from('persons').where('id', supplier.personId).delete()
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    const databaseError = error as { code?: string; errno?: number }
    const message =
      databaseError.code === 'ER_ROW_IS_REFERENCED_2' ||
      databaseError.code === '23503' ||
      databaseError.errno === 1451
        ? 'Supplier cannot be deleted while related records exist'
        : error instanceof Error
          ? error.message
          : String(error)
    const deletionError = new Error(`Error deleting supplier: ${message}`) as Error & { code?: string }
    if (
      databaseError.code === 'ER_ROW_IS_REFERENCED_2' ||
      databaseError.code === '23503' ||
      databaseError.errno === 1451
    ) {
      deletionError.code = 'E_SUPPLIER_REFERENCED'
    }
    throw deletionError
  }
}
