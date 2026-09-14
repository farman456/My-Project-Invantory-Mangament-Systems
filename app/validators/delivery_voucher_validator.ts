import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const fields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  saleOrderId: vine.number().positive().withoutDecimals().exists({ table: 'sale_orders', column: 'id' }),
  customerId: vine.number().positive().withoutDecimals().exists({ table: 'customers', column: 'id' }),
  voucherDetails: vine.string().trim().optional(),
  noOfCartons: vine.number().min(1).withoutDecimals(),
  transporters: vine.string().trim().maxLength(150).optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createDeliveryVoucherValidator = vine.compile(vine.object(fields))
export type createDeliveryVoucherValidatorInterface = Infer<typeof createDeliveryVoucherValidator>
export const updateDeliveryVoucherValidator = vine.compile(vine.object({
  name: fields.name.optional(), saleOrderId: fields.saleOrderId.optional(), customerId: fields.customerId.optional(),
  voucherDetails: fields.voucherDetails, noOfCartons: fields.noOfCartons.optional(), transporters: fields.transporters,
  status: fields.status, actions: fields.actions,
}))
export type updateDeliveryVoucherValidatorInterface = Infer<typeof updateDeliveryVoucherValidator>
export const deliveryVoucherIdValidator = vine.compile(vine.object({ deliveryVoucherId: vine.number().positive().withoutDecimals() }))
