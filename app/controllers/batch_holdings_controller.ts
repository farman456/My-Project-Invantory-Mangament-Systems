import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createBatchHolding,
  deleteBatchHolding,
  getBatchHolding,
  listBatchHoldings,
  updateBatchHolding,
} from '#services/batch_holding_service'
import {
  batchHoldingIdValidator,
  createBatchHoldingValidator,
  updateBatchHoldingValidator,
} from '#validators/batch_holding_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class BatchHoldingsController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const records = await listBatchHoldings(pagination.page, pagination.perPage, options)
      return sendSuccess('Batch holding records listed successfully', records)
    } catch (error) {
      console.log('Batch holding listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createBatchHoldingValidator.validate(ctx.request.body())
      const batchHolding = await createBatchHolding(payload)
      return sendSuccess('Batch holding record created successfully', batchHolding)
    } catch (error) {
      console.log('Batch holding creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { batchHoldingId } = await batchHoldingIdValidator.validate(ctx.params)
      const record = await getBatchHolding(batchHoldingId)
      return sendSuccess('Batch holding record retrieved successfully', record)
    } catch (error) {
      console.log('Batch holding retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { batchHoldingId } = await batchHoldingIdValidator.validate(ctx.params)
      const payload =
        ctx.request.method() === 'PATCH'
          ? await updateBatchHoldingValidator.validate(ctx.request.body())
          : await createBatchHoldingValidator.validate(ctx.request.body())
      const record = await updateBatchHolding(payload, batchHoldingId)
      return sendSuccess('Batch holding record updated successfully', record)
    } catch (error) {
      console.log('Batch holding updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { batchHoldingId } = await batchHoldingIdValidator.validate(ctx.params)
      await deleteBatchHolding(batchHoldingId)
      return sendSuccess('Batch holding record deleted successfully')
    } catch (error) {
      console.log('Batch holding deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
