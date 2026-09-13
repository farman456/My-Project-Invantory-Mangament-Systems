import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const fields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  saleInvoiceId: vine.number().positive().withoutDecimals().exists({ table: 'sale_invoices', column: 'id' }),
  customerId: vine.number().positive().withoutDecimals().exists({ table: 'customers', column: 'id' }),
  returnDetails: vine.string().trim().optional(),
  noOfItems: vine.number().positive().withoutDecimals(),
  refundValue: vine.number().min(0).max(9999999999.99),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createSaleReturnValidator = vine.compile(vine.object(fields))
export type createSaleReturnValidatorInterface = Infer<typeof createSaleReturnValidator>
export const updateSaleReturnValidator = vine.compile(vine.object({
  name: fields.name.optional(), saleInvoiceId: fields.saleInvoiceId.optional(), customerId: fields.customerId.optional(),
  returnDetails: fields.returnDetails, noOfItems: fields.noOfItems.optional(), refundValue: fields.refundValue.optional(),
  status: fields.status, actions: fields.actions,
}))
export type updateSaleReturnValidatorInterface = Infer<typeof updateSaleReturnValidator>
export const saleReturnIdValidator = vine.compile(vine.object({ saleReturnId: vine.number().positive().withoutDecimals() }))
