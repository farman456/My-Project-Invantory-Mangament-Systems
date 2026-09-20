import ExpiryDamage from '#models/expiry_damage'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createExpiryDamageValidatorInterface,
  updateExpiryDamageValidatorInterface,
} from '#validators/expiry_damage_validator'

export const listExpiryDamage = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(ExpiryDamage.query(), options, {
      searchColumns: ['expiry_damage.ed_details', 'expiry_damage.status'],
      sortColumns: { id: 'expiry_damage.id', supplier: 'expiry_damage.supplier', type: 'expiry_damage.type', status: 'expiry_damage.status' },
    })
    if (options.supplier !== undefined) query.where('expiry_damage.supplier', options.supplier)
    if (options.type !== undefined) query.where('expiry_damage.type', options.type)
    if (options.status !== undefined) query.where('expiry_damage.status', options.status)
    if (options.productId !== undefined) {
      query.whereRaw(
        "(expiry_damage.ed_details::jsonb -> 'items') @> jsonb_build_array(jsonb_build_object('productId', ?::int))",
        [options.productId]
      )
    }
    const paginator = await query
      .select('id', 'ed_details', 'supplier', 'type', 'status', 'actions')
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
    throw new Error(`Error retrieving expiry and damage records: ${message}`)
  }
}

export const createExpiryDamage = async (payload: createExpiryDamageValidatorInterface) => {
  try {
    return await ExpiryDamage.create({
      edDetails: JSON.stringify(payload.edDetails),
      supplier: payload.supplier,
      type: payload.type,
      status: payload.status,
      actions: payload.actions,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating expiry and damage record: ${message}`)
  }
}

export const updateExpiryDamage = async (
  payload: updateExpiryDamageValidatorInterface,
  expiryDamageId: number
) => {
  try {
    const expiryDamage = await ExpiryDamage.find(expiryDamageId)
    if (!expiryDamage)
      throw new Error(`Expiry and damage record with ID: ${expiryDamageId} does not exist`)

    const data: Record<string, any> = {}
    if (payload.edDetails !== undefined) data.edDetails = JSON.stringify(payload.edDetails)
    if (payload.supplier !== undefined) data.supplier = payload.supplier
    if (payload.type !== undefined) data.type = payload.type
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions

    return await expiryDamage.merge(data).save()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating expiry and damage record: ${message}`)
  }
}

export const deleteExpiryDamage = async (expiryDamageId: number) => {
  try {
    const expiryDamage = await ExpiryDamage.find(expiryDamageId)
    if (!expiryDamage)
      throw new Error(`Expiry and damage record with ID: ${expiryDamageId} does not exist`)
    await expiryDamage.delete()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting expiry and damage record: ${message}`)
  }
}

export const getExpiryDamage = async (expiryDamageId: number) => {
  try {
    const expiryDamage = await ExpiryDamage.find(expiryDamageId)
    if (!expiryDamage) {
      throw new Error(`Expiry and damage record with ID: ${expiryDamageId} does not exist`)
    }
    return expiryDamage
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving expiry and damage record: ${message}`)
  }
}
