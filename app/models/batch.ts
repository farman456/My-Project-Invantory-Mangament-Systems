import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'
import Warehouse from '#models/warehouse'
import InventoryLevel from '#models/inventory_level'
import StockMovement from '#models/stock_movement'

export default class Batch extends BaseModel {
  static table = 'batches'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'product_id' })
  declare productId: number

  @column({ columnName: 'batch_number' })
  declare batchNumber: string

  @column({ columnName: 'warehouse_id' })
  declare warehouseId: number | null

  @column({ columnName: 'expiry_date' })
  declare expiryDate: DateTime | null

  @column({ serialize: (value: number | string | null) => value === null || value === undefined ? value : Number(value) })
  declare unitCost: number | null

  @column({ columnName: 'quantity_received', serialize: (value: number | string | null) => value === null || value === undefined ? value : Number(value) })
  declare quantityReceived: number

  @column({ columnName: 'quantity_available', serialize: (value: number | string | null) => value === null || value === undefined ? value : Number(value) })
  declare quantityAvailable: number

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Warehouse, { foreignKey: 'warehouseId' })
  declare warehouse: BelongsTo<typeof Warehouse>

  @hasMany(() => InventoryLevel, { foreignKey: 'batchId' })
  declare inventoryLevels: HasMany<typeof InventoryLevel>

  @hasMany(() => StockMovement, { foreignKey: 'batchId' })
  declare stockMovements: HasMany<typeof StockMovement>
}
