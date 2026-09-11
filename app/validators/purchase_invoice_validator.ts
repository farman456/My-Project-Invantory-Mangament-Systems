import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createPurchaseInvoiceValidator = vine.compile(
  vine.object({
    /**
     * Required to create the actual purchase invoice record (purchase_invoices.name varchar(150))
     */
    name: vine.string().trim().minLength(1).maxLength(150),
    /**
     * Purchase_invoices.purchase_order_id references purchase_orders.id
     */
    purchaseOrderId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'purchase_orders', column: 'id' }),
    /**
     * Purchase_invoices.supplier_id references suppliers.id
     */
    supplierId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' }),
    /**
     * Purchase_invoices.invoice_details text - optional descriptive field
     */
    invoiceDetails: vine.string().trim().optional(),
    /**
     * Purchase_invoices.no_of_items - positive integer value
     */
    noOfItems: vine.number().positive().withoutDecimals(),
    /**
     * Purchase_invoices.invoice_value decimal(12,2) - non-negative numeric value
     */
    invoiceValue: vine.number().min(0).max(9999999999.99),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createPurchaseInvoiceValidatorInterface = Infer<typeof createPurchaseInvoiceValidator>

export const updatePurchaseInvoiceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    purchaseOrderId: vine.number().positive().withoutDecimals().exists({ table: 'purchase_orders', column: 'id' }).optional(),
    supplierId: vine.number().positive().withoutDecimals().exists({ table: 'suppliers', column: 'id' }).optional(),
    invoiceDetails: vine.string().trim().optional(),
    noOfItems: vine.number().positive().withoutDecimals().optional(),
    invoiceValue: vine.number().min(0).max(9999999999.99).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updatePurchaseInvoiceValidatorInterface = Infer<typeof updatePurchaseInvoiceValidator>

export const purchaseInvoiceIdValidator = vine.compile(
  vine.object({ purchaseInvoiceId: vine.number().positive().withoutDecimals() })
)
