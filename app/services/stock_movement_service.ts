import StockMovement from '#models/stock_movement'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'
import {
  createStockMovementValidatorInterface,
  updateStockMovementValidatorInterface,
} from '#validators/stock_movement_validator'

export const listStockMovements = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(StockMovement.query(), options, {
      searchColumns: ['stock_movements.movement_details', 'stock_movements.status'],
      sortColumns: { id: 'stock_movements.id', supplier: 'stock_movements.supplier', type: 'stock_movements.type', status: 'stock_movements.status' },
    })
    if (options.supplier !== undefined) query.where('stock_movements.supplier', options.supplier)
    if (options.type !== undefined) query.where('stock_movements.type', options.type)
    if (options.status !== undefined) query.where('stock_movements.status', options.status)
    if (options.productId !== undefined) {
      query.whereRaw('JSON_CONTAINS(stock_movements.movement_details, JSON_OBJECT(?, ?), ?)', ['productId', options.productId, '$.items'])
    }
    const paginator = await query
      .select('id', 'movement_details', 'supplier', 'type', 'status', 'actions')
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
    throw new Error(`Error retrieving stock movements: ${message}`)
  }
}

export const createStockMovement = async (payload: createStockMovementValidatorInterface) => {
  try {
    return await StockMovement.create({
      movementDetails: JSON.stringify(payload.movementDetails),
      supplier: payload.supplier,
      type: payload.type,
      status: payload.status,
      actions: payload.actions,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error creating stock movement: ${message}`)
  }
}

export const updateStockMovement = async (
  payload: updateStockMovementValidatorInterface,
  stockMovementId: number
) => {
  try {
    const stockMovement = await StockMovement.find(stockMovementId)
    if (!stockMovement) throw new Error(`Stock movement with ID: ${stockMovementId} does not exist`)

    const data: Record<string, any> = {}
    if (payload.movementDetails !== undefined) {
      data.movementDetails = JSON.stringify(payload.movementDetails)
    }
    if (payload.supplier !== undefined) data.supplier = payload.supplier
    if (payload.type !== undefined) data.type = payload.type
    if (payload.status !== undefined) data.status = payload.status
    if (payload.actions !== undefined) data.actions = payload.actions

    return await stockMovement.merge(data).save()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error updating stock movement: ${message}`)
  }
}

export const deleteStockMovement = async (stockMovementId: number) => {
  try {
    const stockMovement = await StockMovement.find(stockMovementId)
    if (!stockMovement) throw new Error(`Stock movement with ID: ${stockMovementId} does not exist`)
    await stockMovement.delete()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error deleting stock movement: ${message}`)
  }
}

export const getStockMovement = async (stockMovementId: number) => {
  try {
    const stockMovement = await StockMovement.find(stockMovementId)
    if (!stockMovement) {
      throw new Error(`Stock movement with ID: ${stockMovementId} does not exist`)
    }
    return stockMovement
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving stock movement: ${message}`)
  }
}
