import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import SaleInvoice from '#models/sale_invoice'

export default class SaleReturn extends BaseModel {
  static table = 'sale_returns'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare saleInvoiceId: number | null

  @column()
  declare customerId: number | null

  @column()
  declare returnDetails: string | null

  @column()
  declare name: string | null

  @column()
  declare noOfItems: number | null

  @column({ serialize: (value: number | string | null) => value === null || value === undefined ? value : Number(value) })
  declare refundValue: number | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null

  @belongsTo(() => SaleInvoice, { foreignKey: 'saleInvoiceId' })
  declare saleInvoice: BelongsTo<typeof SaleInvoice>

  @belongsTo(() => Customer, { foreignKey: 'customerId' })
  declare customer: BelongsTo<typeof Customer>
}
