import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import { createSaleInvoiceValidator, saleInvoiceIdValidator, updateSaleInvoiceValidator } from '#validators/sale_invoice_validator'
import { createSaleInvoice, deleteSaleInvoice, getSaleInvoice, listSaleInvoices, updateSaleInvoice } from '#services/sale_invoice_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { normalizeSaleInvoicePayload } from '#helpers/sale_payload_helper'

export default class SaleInvoicesController {
  async index(ctx: HttpContext) { try { const { page, perPage } = ctx.request.qs(); const pagination = await listPaginationValidator.validate({ page: page === undefined ? undefined : Number(page), perPage: perPage === undefined ? undefined : Number(perPage) }); return sendSuccess('Sale invoices listed successfully', await listSaleInvoices(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs()))) } catch (error) { console.log('Sale invoice listing error', error); return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { saleInvoiceId } = await saleInvoiceIdValidator.validate(ctx.params); return sendSuccess('Sale invoice retrieved successfully', await getSaleInvoice(saleInvoiceId)) } catch (error) { console.log('Sale invoice retrieval error', error); return ErrorService.handleError(ctx, error) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Sale invoice created successfully', await createSaleInvoice(await createSaleInvoiceValidator.validate(normalizeSaleInvoicePayload(ctx.request.body())))) } catch (error) { console.log('Sale invoice creating error', error); return ErrorService.handleError(ctx, error) } }
  async update(ctx: HttpContext) { try { const { saleInvoiceId } = await saleInvoiceIdValidator.validate(ctx.params); const normalized = normalizeSaleInvoicePayload(ctx.request.body()); const payload = ctx.request.method() === 'PATCH' ? await updateSaleInvoiceValidator.validate(normalized) : await createSaleInvoiceValidator.validate(normalized); return sendSuccess('Sale invoice updated successfully', await updateSaleInvoice(payload, saleInvoiceId)) } catch (error) { console.log('Sale invoice updating error', error); return ErrorService.handleError(ctx, error) } }
  async delete(ctx: HttpContext) { try { const { saleInvoiceId } = await saleInvoiceIdValidator.validate(ctx.params); await deleteSaleInvoice(saleInvoiceId); return sendSuccess('Sale invoice deleted successfully') } catch (error) { console.log('Sale invoice deleting error', error); return ErrorService.handleError(ctx, error) } }
}
