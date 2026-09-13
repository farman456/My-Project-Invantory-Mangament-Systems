import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import PurchaseInvoice from '#models/purchase_invoice'

export default class PurchaseReturn extends BaseModel {
  static table = 'purchase_returns'

  @column({ isPrimary: true })
  declare id: number

  /**
   * References the "purchase_invoices" table (purchase_invoices.id)
   */
  @column()
  declare purchaseInvoiceId: number | null

  /**
   * References the "suppliers" table (suppliers.id)
   */
  @column()
  declare supplierId: number | null

  @column()
  declare returnDetails: string | null

  @column()
  declare name: string | null

  @column()
  declare status: string | null

  @column()
  declare noOfCartons: number | null

  /**
   * Decimal(12,2). Serialize always as number to keep the API contract clean.
   */
  @column({
    serialize: (value: number | string | null) => {
      return value === null || value === undefined ? value : Number(value)
    },
  })
  declare refundValue: number | null

  @column()
  declare actions: string | null

  @belongsTo(() => PurchaseInvoice, { foreignKey: 'purchaseInvoiceId' })
  declare purchaseInvoice: BelongsTo<typeof PurchaseInvoice>

  @belongsTo(() => Supplier, { foreignKey: 'supplierId' })
  declare supplier: BelongsTo<typeof Supplier>
}