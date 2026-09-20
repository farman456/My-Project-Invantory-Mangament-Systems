import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createPurchaseReturn,
  deletePurchaseReturn,
  getPurchaseReturn,
  listPurchaseReturns,
  updatePurchaseReturn,
} from '#services/purchase_return_service'
import {
  createPurchaseReturnValidator,
  purchaseReturnIdValidator,
  updatePurchaseReturnValidator,
} from '#validators/purchase_return_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { normalizePurchaseReturnPayload } from '#helpers/purchase_payload_helper'

export default class PurchaseReturnsController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({ page: page === undefined ? undefined : Number(page), perPage: perPage === undefined ? undefined : Number(perPage) })
      return sendSuccess('Purchase returns listed successfully', await listPurchaseReturns(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs())))
    } catch (error) {
      console.log('Purchase return listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { purchaseReturnId } = await purchaseReturnIdValidator.validate(ctx.params)
      return sendSuccess('Purchase return retrieved successfully', await getPurchaseReturn(purchaseReturnId))
    } catch (error) {
      console.log('Purchase return retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createPurchaseReturnValidator.validate(normalizePurchaseReturnPayload(ctx.request.body()))
      const purchaseReturn = await createPurchaseReturn(payload)
      return sendSuccess('Purchase return created successfully', purchaseReturn)
    } catch (error) {
      console.log('Purchase return creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { purchaseReturnId } = await purchaseReturnIdValidator.validate(ctx.params)
      const normalized = normalizePurchaseReturnPayload(ctx.request.body())
      const payload = ctx.request.method() === 'PATCH' ? await updatePurchaseReturnValidator.validate(normalized) : await createPurchaseReturnValidator.validate(normalized)
      return sendSuccess('Purchase return updated successfully', await updatePurchaseReturn(payload, purchaseReturnId))
    } catch (error) {
      console.log('Purchase return updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { purchaseReturnId } = await purchaseReturnIdValidator.validate(ctx.params)
      await deletePurchaseReturn(purchaseReturnId)
      return sendSuccess('Purchase return deleted successfully')
    } catch (error) {
      console.log('Purchase return deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}