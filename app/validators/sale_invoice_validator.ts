import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const fields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  saleOrderId: vine.number().positive().withoutDecimals().exists({ table: 'sale_orders', column: 'id' }),
  customerId: vine.number().positive().withoutDecimals().exists({ table: 'customers', column: 'id' }),
  invoiceDetails: vine.string().trim().optional(),
  noOfItems: vine.number().min(1).withoutDecimals(),
  referral: vine.string().trim().maxLength(150).optional(),
  invoiceValue: vine.number().min(0).max(9999999999.99),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createSaleInvoiceValidator = vine.compile(vine.object(fields))
export type createSaleInvoiceValidatorInterface = Infer<typeof createSaleInvoiceValidator>
export const updateSaleInvoiceValidator = vine.compile(vine.object({
  name: fields.name.optional(), saleOrderId: fields.saleOrderId.optional(), customerId: fields.customerId.optional(),
  invoiceDetails: fields.invoiceDetails, noOfItems: fields.noOfItems.optional(), referral: fields.referral,
  invoiceValue: fields.invoiceValue.optional(), status: fields.status, actions: fields.actions,
}))
export type updateSaleInvoiceValidatorInterface = Infer<typeof updateSaleInvoiceValidator>
export const saleInvoiceIdValidator = vine.compile(vine.object({ saleInvoiceId: vine.number().positive().withoutDecimals() }))
