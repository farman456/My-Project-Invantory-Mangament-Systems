import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import SaleOrder from '#models/sale_order'

export default class SaleInvoice extends BaseModel {
  static table = 'sale_invoices'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare saleOrderId: number | null

  @column()
  declare customerId: number | null

  @column({ serialize: (value: string | null) => { if (!value) return value; try { return JSON.parse(value) } catch { return value } } })
  declare invoiceDetails: Record<string, unknown> | string | null

  @column()
  declare name: string | null

  @column()
  declare noOfItems: number | null

  @column()
  declare referral: string | null

  @column({ serialize: (value: number | string | null) => value === null || value === undefined ? value : Number(value) })
  declare invoiceValue: number | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null

  @belongsTo(() => SaleOrder, { foreignKey: 'saleOrderId' })
  declare saleOrder: BelongsTo<typeof SaleOrder>

  @belongsTo(() => Customer, { foreignKey: 'customerId' })
  declare customer: BelongsTo<typeof Customer>
}
