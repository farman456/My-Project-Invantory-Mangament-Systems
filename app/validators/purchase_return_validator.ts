import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createPurchaseReturnValidator = vine.compile(
  vine.object({
    /**
     * Required to create the actual purchase return record (purchase_returns.name varchar(150))
     */
    name: vine.string().trim().minLength(1).maxLength(150),
    /**
     * Purchase_returns.purchase_invoice_id references purchase_invoices.id
     */
    purchaseInvoiceId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'purchase_invoices', column: 'id' }),
    /**
     * Purchase_returns.supplier_id references suppliers.id
     */
    supplierId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' }),
    /**
     * Purchase_returns.return_details text - optional descriptive field
     */
    returnDetails: vine.string().trim().optional(),
    /**
     * Purchase_returns.no_of_cartons - positive integer value
     */
    noOfCartons: vine.number().positive().withoutDecimals(),
    /**
     * Purchase_returns.refund_value decimal(12,2) - non-negative numeric value
     */
    refundValue: vine.number().min(0).max(9999999999.99),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createPurchaseReturnValidatorInterface = Infer<typeof createPurchaseReturnValidator>

export const updatePurchaseReturnValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    purchaseInvoiceId: vine.number().positive().withoutDecimals().exists({ table: 'purchase_invoices', column: 'id' }).optional(),
    supplierId: vine.number().positive().withoutDecimals().exists({ table: 'suppliers', column: 'id' }).optional(),
    returnDetails: vine.string().trim().optional(),
    noOfCartons: vine.number().positive().withoutDecimals().optional(),
    refundValue: vine.number().min(0).max(9999999999.99).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updatePurchaseReturnValidatorInterface = Infer<typeof updatePurchaseReturnValidator>

export const purchaseReturnIdValidator = vine.compile(
  vine.object({ purchaseReturnId: vine.number().positive().withoutDecimals() })
)
