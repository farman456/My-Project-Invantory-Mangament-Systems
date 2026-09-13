import db from '@adonisjs/lucid/services/db'
import Distributor from '#models/distributor'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createDistributorValidatorInterface,
  updateDistributorPatchValidatorInterface,
  updateDistributorValidatorInterface,
} from '#validators/distributor_validator'

const personSelect = [
  'distributors.id',
  'distributors.person_id as personId',
  'persons.name',
  'persons.contact_person as contactPerson',
  'persons.phone',
  'persons.email',
  'persons.area_city as areaCity',
  'persons.status',
  'persons.actions',
]

export const listDistributors = async (page = 1, perPage = 100, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(db.from('distributors'), options, {
      searchColumns: ['persons.name', 'persons.contact_person', 'persons.email'],
      sortColumns: { id: 'distributors.id', name: 'persons.name', status: 'persons.status' },
    }).join('persons', 'persons.id', 'distributors.person_id')
    if (options.status !== undefined) query.where('persons.status', options.status)
    const paginator = await query.select(...personSelect).paginate(page, perPage)
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
    throw new Error(`Error retrieving distributors: ${message}`)
  }
}

export const createDistributor = async (payload: createDistributorValidatorInterface) => {
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
    const [distributorId] = await transaction.table('distributors').insert({ person_id: personId })
    await transaction.commit()
    return { id: distributorId, personId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating distributor: ${message}`)
  }
}

export const getDistributor = async (distributorId: number) => {
  try {
    const distributor = await db
      .from('distributors')
      .join('persons', 'persons.id', 'distributors.person_id')
      .select(...personSelect)
      .where('distributors.id', distributorId)
      .first()
    if (!distributor) throw new Error(`Distributor with ID: ${distributorId} does not exist`)
    return distributor
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving distributor: ${message}`)
  }
}

export const updateDistributor = async (
  payload: updateDistributorValidatorInterface | updateDistributorPatchValidatorInterface,
  distributorId: number
) => {
  const transaction = await db.transaction()
  try {
    const distributor = await Distributor.find(distributorId)
    if (!distributor) throw new Error(`Distributor with ID: ${distributorId} does not exist`)
    if (!distributor.personId) throw new Error(`Distributor with ID: ${distributorId} has no person record`)
    const data: Record<string, unknown> = {}
    if (payload.name !== undefined) data.name = payload.name
    if (payload.contactPerson !== undefined) data.contact_person = payload.contactPerson
    if (payload.phone !== undefined) data.phone = payload.phone
    if (payload.email !== undefined) data.email = payload.email
    if (payload.areaCity !== undefined) data.area_city = payload.areaCity
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions
    await transaction.from('persons').where('id', distributor.personId).update(data)
    await transaction.commit()
    return { id: distributor.id, personId: distributor.personId, ...payload }
  } catch (error) {
    await transaction.rollback()
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating distributor: ${message}`)
  }
}

export const deleteDistributor = async (distributorId: number) => {
  const transaction = await db.transaction()
  try {
    const distributor = await Distributor.find(distributorId)
    if (!distributor) throw new Error(`Distributor with ID: ${distributorId} does not exist`)
    if (!distributor.personId) throw new Error(`Distributor with ID: ${distributorId} has no person record`)
    await transaction.from('distributors').where('id', distributorId).delete()
    await transaction.from('persons').where('id', distributor.personId).delete()
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    const databaseError = error as { code?: string; errno?: number }
    const message = databaseError.code === 'ER_ROW_IS_REFERENCED_2' || databaseError.errno === 1451
      ? 'Distributor cannot be deleted because it is referenced by another record'
      : error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting distributor: ${message}`)
  }
}