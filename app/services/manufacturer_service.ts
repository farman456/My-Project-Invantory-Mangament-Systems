import db from '@adonisjs/lucid/services/db'
import Manufacturer from '#models/manufacturer'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createManufacturerValidatorInterface,
  updateManufacturerPatchValidatorInterface,
  updateManufacturerValidatorInterface,
} from '#validators/manufacturer_validator'

const personSelect = [
  'manufacturers.id',
  'manufacturers.person_id as personId',
  'persons.name',
  'persons.contact_person as contactPerson',
  'persons.phone',
  'persons.email',
  'persons.area_city as areaCity',
  'persons.status',
  'persons.actions',
]

export const listManufacturers = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(db.from('manufacturers'), options, {
      searchColumns: ['persons.name', 'persons.contact_person', 'persons.email'],
      sortColumns: { id: 'manufacturers.id', name: 'persons.name', status: 'persons.status' },
    })

    if (options.status !== undefined) query.where('persons.status', options.status)
    const paginator = await query
      .join('persons', 'persons.id', 'manufacturers.person_id')
      .select(...personSelect)
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
    throw new Error(`Error retrieving manufacturers: ${message}`)
  }
}

export const createManufacturer = async (payload: createManufacturerValidatorInterface) => {
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
    const [manufacturerId] = await transaction.table('manufacturers').insert({ person_id: personId })
    await transaction.commit()
    return { id: manufacturerId, personId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating manufacturer: ${message}`)
  }
}

export const getManufacturer = async (manufacturerId: number) => {
  try {
    const manufacturer = await db
      .from('manufacturers')
      .join('persons', 'persons.id', 'manufacturers.person_id')
      .select(...personSelect)
      .where('manufacturers.id', manufacturerId)
      .first()
    if (!manufacturer) throw new Error(`Manufacturer with ID: ${manufacturerId} does not exist`)
    return manufacturer
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving manufacturer: ${message}`)
  }
}

export const updateManufacturer = async (
  payload: updateManufacturerValidatorInterface | updateManufacturerPatchValidatorInterface,
  manufacturerId: number
) => {
  const transaction = await db.transaction()
  try {
    const manufacturer = await Manufacturer.find(manufacturerId)
    if (!manufacturer) throw new Error(`Manufacturer with ID: ${manufacturerId} does not exist`)
    if (!manufacturer.personId) throw new Error(`Manufacturer with ID: ${manufacturerId} has no person record`)
    const data: Record<string, unknown> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.contactPerson !== undefined) data.contact_person = payload.contactPerson
    if (payload.phone !== undefined) data.phone = payload.phone
    if (payload.email !== undefined) data.email = payload.email
    if (payload.areaCity !== undefined) data.area_city = payload.areaCity
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions
    await transaction.from('persons').where('id', manufacturer.personId).update(data)
    await transaction.commit()
    return { id: manufacturer.id, personId: manufacturer.personId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating manufacturer: ${message}`)
  }
}

export const deleteManufacturer = async (manufacturerId: number) => {
  const transaction = await db.transaction()
  try {
    const manufacturer = await Manufacturer.find(manufacturerId)
    if (!manufacturer) throw new Error(`Manufacturer with ID: ${manufacturerId} does not exist`)
    if (!manufacturer.personId) throw new Error(`Manufacturer with ID: ${manufacturerId} has no person record`)
    await transaction.from('manufacturers').where('id', manufacturerId).delete()
    await transaction.from('persons').where('id', manufacturer.personId).delete()
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    const databaseError = error as { code?: string; errno?: number }
    const message = databaseError.code === 'ER_ROW_IS_REFERENCED_2' || databaseError.errno === 1451
      ? 'Manufacturer cannot be deleted because it is referenced by another record'
      : error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting manufacturer: ${message}`)
  }
}