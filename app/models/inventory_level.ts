import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import Product from '#models/product'
import Warehouse from '#models/warehouse'
import Batch from '#models/batch'

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

  @column({ columnName: 'product_id' })
  declare productId: number | null

  @belongsTo(() => Product, { foreignKey: 'productId' })
  declare product: BelongsTo<typeof Product>

  @column({ columnName: 'warehouse_id' })
  declare warehouseId: number | null

  @belongsTo(() => Warehouse, { foreignKey: 'warehouseId' })
  declare warehouseRecord: BelongsTo<typeof Warehouse>

  @column({ columnName: 'batch_id' })
  declare batchId: number | null

  @belongsTo(() => Batch, { foreignKey: 'batchId' })
  declare batch: BelongsTo<typeof Batch>

  @column()
  declare warehouse: string | null

  @column()
  declare hold: number | null

  @column()
  declare total: number | null

  @column({ columnName: 'available_quantity' })
  declare availableQuantity: number | null

  @column({ columnName: 'reserved_quantity' })
  declare reservedQuantity: number | null

  @column({ columnName: 'damaged_quantity' })
  declare damagedQuantity: number | null
}