import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { getInventoryLevel, listInventoryLevels } from '#services/inventory_level_service'
import { inventoryLevelIdValidator } from '#validators/inventory_level_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class InventoryLevelsController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const inventoryLevels = await listInventoryLevels(pagination.page, pagination.perPage, options)
      return sendSuccess('Inventory levels listed successfully', inventoryLevels)
    } catch (error) {
      console.log('Inventory levels listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { inventoryLevelId } = await inventoryLevelIdValidator.validate(ctx.params)
      const inventoryLevel = await getInventoryLevel(inventoryLevelId)
      return sendSuccess('Inventory level retrieved successfully', inventoryLevel)
    } catch (error) {
      console.log('Inventory level retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
