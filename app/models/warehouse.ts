import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Batch from '#models/batch'
import InventoryLevel from '#models/inventory_level'
import StockMovement from '#models/stock_movement'

export default class Warehouse extends BaseModel {
  static table = 'warehouses'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare status: string

  @column()
  declare address: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Batch, { foreignKey: 'warehouseId' })
  declare batches: HasMany<typeof Batch>

  @hasMany(() => InventoryLevel, { foreignKey: 'warehouseId' })
  declare inventoryLevels: HasMany<typeof InventoryLevel>

  @hasMany(() => StockMovement, { foreignKey: 'warehouseId' })
  declare stockMovements: HasMany<typeof StockMovement>
}
