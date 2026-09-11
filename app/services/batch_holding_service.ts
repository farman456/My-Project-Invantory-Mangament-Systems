import BatchHolding from '#models/batch_holding'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createBatchHoldingValidatorInterface,
  updateBatchHoldingValidatorInterface,
} from '#validators/batch_holding_validator'

export const listBatchHoldings = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(BatchHolding.query(), options, {
      searchColumns: ['batch_holdings.batch_details', 'batch_holdings.status'],
      sortColumns: { id: 'batch_holdings.id', supplier: 'batch_holdings.supplier', type: 'batch_holdings.type', status: 'batch_holdings.status' },
    })
    if (options.supplier !== undefined) query.where('batch_holdings.supplier', options.supplier)
    if (options.type !== undefined) query.where('batch_holdings.type', options.type)
    if (options.status !== undefined) query.where('batch_holdings.status', options.status)
    if (options.productId !== undefined) {
      query.whereRaw('JSON_CONTAINS(batch_holdings.batch_details, JSON_OBJECT(?, ?), ?)', ['productId', options.productId, '$.items'])
    }
    const paginator = await query
      .select('id', 'batch_details', 'supplier', 'type', 'status', 'action')
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
    throw new Error(`Error retrieving batch holding records: ${message}`)
  }
}

export const createBatchHolding = async (payload: createBatchHoldingValidatorInterface) => {
  try {
    return await BatchHolding.create({
      batchDetails: JSON.stringify(payload.batchDetails),
      supplier: payload.supplier,
      type: payload.type,
      status: payload.status,
      action: payload.action,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating batch holding record: ${message}`)
  }
}

export const updateBatchHolding = async (
  payload: updateBatchHoldingValidatorInterface,
  batchHoldingId: number
) => {
  try {
    const batchHolding = await BatchHolding.find(batchHoldingId)
    if (!batchHolding)
      throw new Error(`Batch holding record with ID: ${batchHoldingId} does not exist`)

    const data: Record<string, any> = {}
    if (payload.batchDetails !== undefined) data.batchDetails = JSON.stringify(payload.batchDetails)
    if (payload.supplier !== undefined) data.supplier = payload.supplier
    if (payload.type !== undefined) data.type = payload.type
    if (payload.status !== undefined) data.status = payload.status
    if (payload.action !== undefined) data.action = payload.action

    return await batchHolding.merge(data).save()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating batch holding record: ${message}`)
  }
}

export const deleteBatchHolding = async (batchHoldingId: number) => {
  try {
    const batchHolding = await BatchHolding.find(batchHoldingId)
    if (!batchHolding)
      throw new Error(`Batch holding record with ID: ${batchHoldingId} does not exist`)
    await batchHolding.delete()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting batch holding record: ${message}`)
  }
}

export const getBatchHolding = async (batchHoldingId: number) => {
  try {
    const batchHolding = await BatchHolding.find(batchHoldingId)
    if (!batchHolding) {
      throw new Error(`Batch holding record with ID: ${batchHoldingId} does not exist`)
    }
    return batchHolding
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving batch holding record: ${message}`)
  }
}
