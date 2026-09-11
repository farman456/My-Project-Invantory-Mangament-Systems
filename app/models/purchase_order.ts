import { BaseModel, column } from '@adonisjs/lucid/orm'

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

  @column()
  declare orderDetails: string | null

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
}