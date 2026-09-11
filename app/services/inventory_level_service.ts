import InventoryLevel from '#models/inventory_level'
import { applyListQuery } from '#helpers/list_query_helper'
import type { ListQueryOptions } from '#validators/list_query_validator'

export const listInventoryLevels = async (page = 1, perPage = 25, options: ListQueryOptions = {}) => {
  try {
    const query = applyListQuery(InventoryLevel.query(), options, {
      searchColumns: ['inventory_levels.name', 'inventory_levels.warehouse'],
      sortColumns: { id: 'inventory_levels.id', name: 'inventory_levels.name', hold: 'inventory_levels.hold', total: 'inventory_levels.total' },
    })
    if (options.supplier !== undefined) query.where('inventory_levels.supplier', options.supplier)
    if (options.warehouse !== undefined) query.where('inventory_levels.warehouse', options.warehouse)
    if (options.hold !== undefined) query.where('inventory_levels.hold', options.hold)
    if (options.total !== undefined) query.where('inventory_levels.total', options.total)
    const paginator = await query
      .select('id', 'name', 'supplier', 'warehouse', 'hold', 'total')
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
    throw new Error(`Error retrieving inventory levels: ${message}`)
  }
}

export const getInventoryLevel = async (inventoryLevelId: number) => {
  try {
    const inventoryLevel = await InventoryLevel.find(inventoryLevelId)
    if (!inventoryLevel) {
      throw new Error(`Inventory level with ID: ${inventoryLevelId} does not exist`)
    }
    return inventoryLevel
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Error retrieving inventory level: ${message}`)
  }
}
