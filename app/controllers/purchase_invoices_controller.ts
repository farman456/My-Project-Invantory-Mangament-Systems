import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createPurchaseInvoice,
  deletePurchaseInvoice,
  getPurchaseInvoice,
  listPurchaseInvoices,
  updatePurchaseInvoice,
} from '#services/purchase_invoice_service'
import {
  createPurchaseInvoiceValidator,
  purchaseInvoiceIdValidator,
  updatePurchaseInvoiceValidator,
} from '#validators/purchase_invoice_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { normalizePurchaseInvoicePayload } from '#helpers/purchase_payload_helper'

export default class PurchaseInvoicesController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({ page: page === undefined ? undefined : Number(page), perPage: perPage === undefined ? undefined : Number(perPage) })
      return sendSuccess('Purchase invoices listed successfully', await listPurchaseInvoices(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs())))
    } catch (error) {
      console.log('Purchase invoice listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { purchaseInvoiceId } = await purchaseInvoiceIdValidator.validate(ctx.params)
      return sendSuccess('Purchase invoice retrieved successfully', await getPurchaseInvoice(purchaseInvoiceId))
    } catch (error) {
      console.log('Purchase invoice retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createPurchaseInvoiceValidator.validate(normalizePurchaseInvoicePayload(ctx.request.body()))
      const purchaseInvoice = await createPurchaseInvoice(payload)
      return sendSuccess('Purchase invoice created successfully', purchaseInvoice)
    } catch (error) {
      console.log('Purchase invoice creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { purchaseInvoiceId } = await purchaseInvoiceIdValidator.validate(ctx.params)
      const normalized = normalizePurchaseInvoicePayload(ctx.request.body())
      const payload = ctx.request.method() === 'PATCH' ? await updatePurchaseInvoiceValidator.validate(normalized) : await createPurchaseInvoiceValidator.validate(normalized)
      return sendSuccess('Purchase invoice updated successfully', await updatePurchaseInvoice(payload, purchaseInvoiceId))
    } catch (error) {
      console.log('Purchase invoice updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { purchaseInvoiceId } = await purchaseInvoiceIdValidator.validate(ctx.params)
      await deletePurchaseInvoice(purchaseInvoiceId)
      return sendSuccess('Purchase invoice deleted successfully')
    } catch (error) {
      console.log('Purchase invoice deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}