import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import { createDeliveryVoucherValidator, deliveryVoucherIdValidator, updateDeliveryVoucherValidator } from '#validators/delivery_voucher_validator'
import { createDeliveryVoucher, deleteDeliveryVoucher, getDeliveryVoucher, listDeliveryVouchers, updateDeliveryVoucher } from '#services/delivery_voucher_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { normalizeDeliveryVoucherPayload } from '#helpers/sale_payload_helper'

export default class DeliveryVouchersController {
  async index(ctx: HttpContext) { try { const { page, perPage } = ctx.request.qs(); const pagination = await listPaginationValidator.validate({ page: page === undefined ? undefined : Number(page), perPage: perPage === undefined ? undefined : Number(perPage) }); return sendSuccess('Delivery vouchers listed successfully', await listDeliveryVouchers(pagination.page, pagination.perPage, await validateListQuery(ctx.request.qs()))) } catch (error) { console.log('Delivery voucher listing error', error); return ErrorService.handleError(ctx, error) } }
  async show(ctx: HttpContext) { try { const { deliveryVoucherId } = await deliveryVoucherIdValidator.validate(ctx.params); return sendSuccess('Delivery voucher retrieved successfully', await getDeliveryVoucher(deliveryVoucherId)) } catch (error) { console.log('Delivery voucher retrieval error', error); return ErrorService.handleError(ctx, error) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Delivery voucher created successfully', await createDeliveryVoucher(await createDeliveryVoucherValidator.validate(normalizeDeliveryVoucherPayload(ctx.request.body())))) } catch (error) { console.log('Delivery voucher creating error', error); return ErrorService.handleError(ctx, error) } }
  async update(ctx: HttpContext) { try { const { deliveryVoucherId } = await deliveryVoucherIdValidator.validate(ctx.params); const normalized = normalizeDeliveryVoucherPayload(ctx.request.body()); const payload = ctx.request.method() === 'PATCH' ? await updateDeliveryVoucherValidator.validate(normalized) : await createDeliveryVoucherValidator.validate(normalized); return sendSuccess('Delivery voucher updated successfully', await updateDeliveryVoucher(payload, deliveryVoucherId)) } catch (error) { console.log('Delivery voucher updating error', error); return ErrorService.handleError(ctx, error) } }
  async delete(ctx: HttpContext) { try { const { deliveryVoucherId } = await deliveryVoucherIdValidator.validate(ctx.params); await deleteDeliveryVoucher(deliveryVoucherId); return sendSuccess('Delivery voucher deleted successfully') } catch (error) { console.log('Delivery voucher deleting error', error); return ErrorService.handleError(ctx, error) } }
}
