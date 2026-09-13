import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const fields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  customerId: vine.number().positive().withoutDecimals().exists({ table: 'customers', column: 'id' }),
  productId: vine.number().positive().withoutDecimals().exists({ table: 'products', column: 'id' }),
  orderDetails: vine.string().trim().optional(),
  noOfItems: vine.number().positive().withoutDecimals(),
  referral: vine.string().trim().maxLength(150).optional(),
  orderValue: vine.number().min(0).max(9999999999.99),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createSaleOrderValidator = vine.compile(vine.object(fields))
export type createSaleOrderValidatorInterface = Infer<typeof createSaleOrderValidator>

export const updateSaleOrderValidator = vine.compile(vine.object({
  name: fields.name.optional(), customerId: fields.customerId.optional(), productId: fields.productId.optional(),
  orderDetails: fields.orderDetails, noOfItems: fields.noOfItems.optional(), referral: fields.referral,
  orderValue: fields.orderValue.optional(), status: fields.status, actions: fields.actions,
}))
export type updateSaleOrderValidatorInterface = Infer<typeof updateSaleOrderValidator>
export const saleOrderIdValidator = vine.compile(vine.object({ saleOrderId: vine.number().positive().withoutDecimals() }))
