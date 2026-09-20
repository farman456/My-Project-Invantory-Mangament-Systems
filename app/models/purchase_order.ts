import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import Product from '#models/product'

export default class PurchaseOrder extends BaseModel {
  static table = 'purchase_orders'

  @column({ isPrimary: true })
  declare id: number

  /**
   * References the "suppliers" table (suppliers.id)
   */
  @column()
  declare supplierId: number | null

  /**
   * References the "products" table (products.id)
   */
  @column()
  declare productId: number | null

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
  declare orderDetails: Record<string, unknown> | string | null

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
  declare orderValue: number | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null

  @belongsTo(() => Supplier, { foreignKey: 'supplierId' })
  declare supplier: BelongsTo<typeof Supplier>

  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>
}