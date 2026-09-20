import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { createPaymentValidator, paymentIdValidator, updatePaymentValidator } from '#validators/payment_validator'
import { createPayment, deletePayment, getPayment, listPayments, updatePayment } from '#services/payment_service'
export default class PaymentController {
  async index(ctx: HttpContext) { try { return sendSuccess('Payments listed successfully', await listPayments()) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async show(ctx: HttpContext) { try { const { id } = await paymentIdValidator.validate(ctx.params); return sendSuccess('Payment retrieved successfully', await getPayment(id)) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async create(ctx: HttpContext) { try { return sendSuccess('Payment created successfully', await createPayment(await createPaymentValidator.validate(ctx.request.body()))) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async update(ctx: HttpContext) { try { const { id } = await paymentIdValidator.validate(ctx.params); return sendSuccess('Payment updated successfully', await updatePayment(id, await updatePaymentValidator.validate(ctx.request.body()))) } catch (e) { return ErrorService.handleError(ctx, e) } }
  async delete(ctx: HttpContext) { try { const { id } = await paymentIdValidator.validate(ctx.params); await deletePayment(id); return sendSuccess('Payment deleted successfully') } catch (e) { return ErrorService.handleError(ctx, e) } }
}
