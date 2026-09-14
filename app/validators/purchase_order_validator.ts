import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createPurchaseOrderValidator = vine.compile(
  vine.object({
    /**
     * Required to create the actual purchase order record (purchase_orders.name varchar(150))
     */
    name: vine.string().trim().minLength(1).maxLength(150),
    /**
     * Purchase_orders.supplier_id references suppliers.id
     */
    supplierId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' }),
    /**
     * Purchase_orders.product_id references products.id
     */
    productId: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'products', column: 'id' }),
    /**
     * Purchase_orders.order_details text - optional descriptive field
     */
    orderDetails: vine.string().trim().optional(),
    /**
     * Purchase_orders.no_of_items - positive integer value
     */
    noOfItems: vine.number().min(1).withoutDecimals(),
    /**
     * Purchase_orders.order_value decimal(12,2) - non-negative numeric value
     */
    orderValue: vine.number().min(0).max(9999999999.99),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createPurchaseOrderValidatorInterface = Infer<typeof createPurchaseOrderValidator>

export const updatePurchaseOrderValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    supplierId: vine.number().positive().withoutDecimals().exists({ table: 'suppliers', column: 'id' }).optional(),
    productId: vine.number().positive().withoutDecimals().exists({ table: 'products', column: 'id' }).optional(),
    orderDetails: vine.string().trim().optional(),
    noOfItems: vine.number().min(1).withoutDecimals().optional(),
    orderValue: vine.number().min(0).max(9999999999.99).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updatePurchaseOrderValidatorInterface = Infer<typeof updatePurchaseOrderValidator>

export const purchaseOrderIdValidator = vine.compile(
  vine.object({ purchaseOrderId: vine.number().positive().withoutDecimals() })
)
