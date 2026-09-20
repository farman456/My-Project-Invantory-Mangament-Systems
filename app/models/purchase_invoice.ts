import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import PurchaseOrder from '#models/purchase_order'

export default class PurchaseInvoice extends BaseModel {
  static table = 'purchase_invoices'

  @column({ isPrimary: true })
  declare id: number

  /**
   * References the "purchase_orders" table (purchase_orders.id)
   */
  @column()
  declare purchaseOrderId: number | null

  /**
   * References the "suppliers" table (suppliers.id)
   */
  @column()
  declare supplierId: number | null

  @column({
    serialize: (value: string | null) => {
      if (!value) return value
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    },
  })
  declare invoiceDetails: Record<string, unknown> | string | null

  @column()
  declare name: string | null

  @column()
  declare noOfItems: number | null

  /**
   * Decimal(12,2). Serialize always as number to keep the API contract clean.
   */
  @column({
    serialize: (value: number | string | null) => {
      return value === null || value === undefined ? value : Number(value)
    },
  })
  declare invoiceValue: number | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null

  @belongsTo(() => PurchaseOrder, { foreignKey: 'purchaseOrderId' })
  declare purchaseOrder: BelongsTo<typeof PurchaseOrder>

  @belongsTo(() => Supplier, { foreignKey: 'supplierId' })
  declare supplier: BelongsTo<typeof Supplier>
}