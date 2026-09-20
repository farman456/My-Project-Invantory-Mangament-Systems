import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import { createSaleOrderValidator, saleOrderIdValidator, updateSaleOrderValidator } from '#validators/sale_order_validator'
import { createSaleOrder, deleteSaleOrder, getSaleOrder, listSaleOrders, updateSaleOrder } from '#services/sale_order_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { normalizeSaleOrderPayload } from '#helpers/sale_payload_helper'

export default class SaleOrdersController {
  async index(ctx: HttpContext) { try { const { page, perPage } = ctx.request.qs(); const pagination = await listPaginationValidator.validate({ page: page === undefined ? undefined : Number(page), perPage: perPage === undefined ? undefined : Number(perPage) }); return sendSuccess('Sale orders listed successfully', await listSaleOrders(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs()))) } catch (error) { console.log('Sale order listing error', error); return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { saleOrderId } = await saleOrderIdValidator.validate(ctx.params); return sendSuccess('Sale order retrieved successfully', await getSaleOrder(saleOrderId)) } catch (error) { console.log('Sale order retrieval error', error); return ErrorService.handleError(ctx, error) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Sale order created successfully', await createSaleOrder(await createSaleOrderValidator.validate(normalizeSaleOrderPayload(ctx.request.body())))) } catch (error) { console.log('Sale order creating error', error); return ErrorService.handleError(ctx, error) } }
  async update(ctx: HttpContext) { try { const { saleOrderId } = await saleOrderIdValidator.validate(ctx.params); const normalized = normalizeSaleOrderPayload(ctx.request.body()); const payload = ctx.request.method() === 'PATCH' ? await updateSaleOrderValidator.validate(normalized) : await createSaleOrderValidator.validate(normalized); return sendSuccess('Sale order updated successfully', await updateSaleOrder(payload, saleOrderId)) } catch (error) { console.log('Sale order updating error', error); return ErrorService.handleError(ctx, error) } }
  async delete(ctx: HttpContext) { try { const { saleOrderId } = await saleOrderIdValidator.validate(ctx.params); await deleteSaleOrder(saleOrderId); return sendSuccess('Sale order deleted successfully') } catch (error) { console.log('Sale order deleting error', error); return ErrorService.handleError(ctx, error) } }
}
