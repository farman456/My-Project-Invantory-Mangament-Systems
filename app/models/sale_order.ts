import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import Product from '#models/product'

export default class SaleOrder extends BaseModel {
  static table = 'sale_orders'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number | null

  @column()
  declare productId: number | null

  @column({ serialize: (value: string | null) => { if (!value) return value; try { return JSON.parse(value) } catch { return value } } })
  declare orderDetails: Record<string, unknown> | string | null

  @column()
  declare name: string | null

  @column()
  declare noOfItems: number | null

  @column()
  declare referral: string | null

  @column({ serialize: (value: number | string | null) => value === null || value === undefined ? value : Number(value) })
  declare orderValue: number | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null

  @belongsTo(() => Customer, { foreignKey: 'customerId' })
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>
}
