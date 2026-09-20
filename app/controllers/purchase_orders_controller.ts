import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrder,
  listPurchaseOrders,
  updatePurchaseOrder,
} from '#services/purchase_order_service'
import {
  createPurchaseOrderValidator,
  purchaseOrderIdValidator,
  updatePurchaseOrderValidator,
} from '#validators/purchase_order_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { normalizePurchaseOrderPayload } from '#helpers/purchase_payload_helper'

export default class PurchaseOrdersController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      return sendSuccess('Purchase orders listed successfully', await listPurchaseOrders(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs())))
    } catch (error) {
      console.log('Purchase order listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { purchaseOrderId } = await purchaseOrderIdValidator.validate(ctx.params)
      return sendSuccess('Purchase order retrieved successfully', await getPurchaseOrder(purchaseOrderId))
    } catch (error) {
      console.log('Purchase order retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createPurchaseOrderValidator.validate(normalizePurchaseOrderPayload(ctx.request.body()))
      const purchaseOrder = await createPurchaseOrder(payload)
      return sendSuccess('Purchase order created successfully', purchaseOrder)
    } catch (error) {
      console.log('Purchase order creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { purchaseOrderId } = await purchaseOrderIdValidator.validate(ctx.params)
      const normalized = normalizePurchaseOrderPayload(ctx.request.body())
      const payload = ctx.request.method() === 'PATCH'
        ? await updatePurchaseOrderValidator.validate(normalized)
        : await createPurchaseOrderValidator.validate(normalized)
      return sendSuccess('Purchase order updated successfully', await updatePurchaseOrder(payload, purchaseOrderId))
    } catch (error) {
      console.log('Purchase order updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { purchaseOrderId } = await purchaseOrderIdValidator.validate(ctx.params)
      await deletePurchaseOrder(purchaseOrderId)
      return sendSuccess('Purchase order deleted successfully')
    } catch (error) {
      console.log('Purchase order deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}