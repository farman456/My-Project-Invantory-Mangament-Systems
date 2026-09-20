import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'

export default class InventoryLevel extends BaseModel {
  static table = 'inventory_levels'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare supplier: number | null

  @belongsTo(() => Supplier, { foreignKey: 'supplier' })
  declare supplierRecord: BelongsTo<typeof Supplier>

  @column()
  declare warehouse: string | null

  @column()
  declare hold: number | null

  @column()
  declare total: number | null
}