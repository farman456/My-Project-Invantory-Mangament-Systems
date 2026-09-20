import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import { createSaleReturnValidator, saleReturnIdValidator, updateSaleReturnValidator } from '#validators/sale_return_validator'
import { createSaleReturn, deleteSaleReturn, getSaleReturn, listSaleReturns, updateSaleReturn } from '#services/sale_return_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { normalizeSaleReturnPayload } from '#helpers/sale_payload_helper'

export default class SaleReturnsController {
  async index(ctx: HttpContext) { try { const { page, perPage } = ctx.request.qs(); const pagination = await listPaginationValidator.validate({ page: page === undefined ? undefined : Number(page), perPage: perPage === undefined ? undefined : Number(perPage) }); return sendSuccess('Sale returns listed successfully', await listSaleReturns(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs()))) } catch (error) { console.log('Sale return listing error', error); return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { saleReturnId } = await saleReturnIdValidator.validate(ctx.params); return sendSuccess('Sale return retrieved successfully', await getSaleReturn(saleReturnId)) } catch (error) { console.log('Sale return retrieval error', error); return ErrorService.handleError(ctx, error) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Sale return created successfully', await createSaleReturn(await createSaleReturnValidator.validate(normalizeSaleReturnPayload(ctx.request.body())))) } catch (error) { console.log('Sale return creating error', error); return ErrorService.handleError(ctx, error) } }
  async update(ctx: HttpContext) { try { const { saleReturnId } = await saleReturnIdValidator.validate(ctx.params); const normalized = normalizeSaleReturnPayload(ctx.request.body()); const payload = ctx.request.method() === 'PATCH' ? await updateSaleReturnValidator.validate(normalized) : await createSaleReturnValidator.validate(normalized); return sendSuccess('Sale return updated successfully', await updateSaleReturn(payload, saleReturnId)) } catch (error) { console.log('Sale return updating error', error); return ErrorService.handleError(ctx, error) } }
  async delete(ctx: HttpContext) { try { const { saleReturnId } = await saleReturnIdValidator.validate(ctx.params); await deleteSaleReturn(saleReturnId); return sendSuccess('Sale return deleted successfully') } catch (error) { console.log('Sale return deleting error', error); return ErrorService.handleError(ctx, error) } }
}
