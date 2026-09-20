import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import SaleOrder from '#models/sale_order'

export default class DeliveryVoucher extends BaseModel {
  static table = 'delivery_vouchers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare saleOrderId: number | null

  @column()
  declare customerId: number | null

  @column({ serialize: (value: string | null) => { if (!value) return value; try { return JSON.parse(value) } catch { return value } } })
  declare voucherDetails: Record<string, unknown> | string | null

  @column()
  declare name: string | null

  @column()
  declare noOfCartons: number | null

  @column()
  declare transporters: string | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null

  @belongsTo(() => SaleOrder, { foreignKey: 'saleOrderId' })
  declare saleOrder: BelongsTo<typeof SaleOrder>

  @belongsTo(() => Customer, { foreignKey: 'customerId' })
  declare customer: BelongsTo<typeof Customer>
}
