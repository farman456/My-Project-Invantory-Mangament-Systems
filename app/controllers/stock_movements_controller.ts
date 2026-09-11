import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createStockMovement,
  deleteStockMovement,
  getStockMovement,
  listStockMovements,
  updateStockMovement,
} from '#services/stock_movement_service'
import {
  createStockMovementValidator,
  stockMovementIdValidator,
  updateStockMovementValidator,
} from '#validators/stock_movement_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class StockMovementsController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const stockMovements = await listStockMovements(pagination.page, pagination.perPage, options)
      return sendSuccess('Stock movements listed successfully', stockMovements)
    } catch (error) {
      console.log('Stock movements listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createStockMovementValidator.validate(ctx.request.body())
      const stockMovement = await createStockMovement(payload)
      return sendSuccess('Stock movement created successfully', stockMovement)
    } catch (error) {
      console.log('Stock movement creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { stockMovementId } = await stockMovementIdValidator.validate(ctx.params)
      const stockMovement = await getStockMovement(stockMovementId)
      return sendSuccess('Stock movement retrieved successfully', stockMovement)
    } catch (error) {
      console.log('Stock movement retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { stockMovementId } = await stockMovementIdValidator.validate(ctx.params)
      const payload =
        ctx.request.method() === 'PATCH'
          ? await updateStockMovementValidator.validate(ctx.request.body())
          : await createStockMovementValidator.validate(ctx.request.body())
      const stockMovement = await updateStockMovement(payload, stockMovementId)
      return sendSuccess('Stock movement updated successfully', stockMovement)
    } catch (error) {
      console.log('Stock movement updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { stockMovementId } = await stockMovementIdValidator.validate(ctx.params)
      await deleteStockMovement(stockMovementId)
      return sendSuccess('Stock movement deleted successfully')
    } catch (error) {
      console.log('Stock movement deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
