import Person from '#models/person'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createPersonMasterValidatorInterface,
  updatePersonMasterPatchValidatorInterface,
  updatePersonMasterValidatorInterface,
} from '#validators/person_master_validator'

export const listPersonMasters = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(Person.query(), options, {
      searchColumns: ['persons.name', 'persons.contact_person', 'persons.email'],
      sortColumns: {
        id: 'persons.id',
        name: 'persons.name',
        contactPerson: 'persons.contact_person',
        phone: 'persons.phone',
        email: 'persons.email',
        areaCity: 'persons.area_city',
        status: 'persons.status',
      },
    })

    if (options.status !== undefined) query.where('persons.status', options.status)

    const paginator = await query
      .select('id', 'name', 'contact_person', 'phone', 'email', 'area_city', 'status', 'actions')
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
    throw new Error(`Error retrieving persons: ${message}`)
  }
}

export const createPersonMaster = async (payload: createPersonMasterValidatorInterface) => {
  try {
    const person = await Person.create({
      name: payload.name,
      contactPerson: payload.contactPerson,
      phone: payload.phone,
      email: payload.email,
      areaCity: payload.areaCity,
      status: payload.status,
      actions: payload.actions,
    })

    return {
      id: person.id,
      name: person.name,
      contactPerson: person.contactPerson,
      phone: person.phone,
      email: person.email,
      areaCity: person.areaCity,
      status: person.status,
      actions: person.actions,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating person: ${message}`)
  }
}

export const getPersonMaster = async (personMasterId: number) => {
  try {
    const person = await Person.find(personMasterId)

    if (!person) {
      throw new Error(`Person with ID: ${personMasterId} does not exist`)
    }

    return {
      id: person.id,
      name: person.name,
      contactPerson: person.contactPerson,
      phone: person.phone,
      email: person.email,
      areaCity: person.areaCity,
      status: person.status,
      actions: person.actions,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving person: ${message}`)
  }
}

export const updatePersonMaster = async (
  payload: updatePersonMasterValidatorInterface | updatePersonMasterPatchValidatorInterface,
  personMasterId: number
) => {
  try {
    const person = await Person.find(personMasterId)

    if (!person) {
      throw new Error(`Person with ID: ${personMasterId} does not exist`)
    }

    const data: Record<string, any> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.contactPerson !== undefined) data.contactPerson = payload.contactPerson
    if (payload.phone !== undefined) data.phone = payload.phone
    if (payload.email !== undefined) data.email = payload.email
    if (payload.areaCity !== undefined) data.areaCity = payload.areaCity
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions

    const updated = await person.merge(data).save()

    return {
      id: updated.id,
      name: updated.name,
      contactPerson: updated.contactPerson,
      phone: updated.phone,
      email: updated.email,
      areaCity: updated.areaCity,
      status: updated.status,
      actions: updated.actions,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating person: ${message}`)
  }
}

export const deletePersonMaster = async (personMasterId: number) => {
  try {
    const person = await Person.find(personMasterId)

    if (!person) {
      throw new Error(`Person with ID: ${personMasterId} does not exist`)
    }

    await person.delete()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting person: ${message}`)
  }
}
