import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import Type from '#models/type'
import Product from '#models/product'
import Warehouse from '#models/warehouse'
import Batch from '#models/batch'

export default class StockMovement extends BaseModel {
  static table = 'stock_movements'

  @column({ isPrimary: true })
  declare id: number

  @column({
    serialize: (value: string | null) => (value ? JSON.parse(value) : value),
  })
  declare movementDetails: string | null

  @column()
  declare supplier: number | null

  @column()
  declare type: number | null

  @belongsTo(() => Supplier, { foreignKey: 'supplier' })
  declare supplierRecord: BelongsTo<typeof Supplier>

  @belongsTo(() => Type, { foreignKey: 'type' })
  declare typeRecord: BelongsTo<typeof Type>

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

  @column({ columnName: 'quantity_delta' })
  declare quantityDelta: number | null

  @column({ columnName: 'unit_cost' })
  declare unitCost: number | null

  @column({ columnName: 'movement_reason' })
  declare movementReason: string | null

  @column({ columnName: 'source_type' })
  declare sourceType: string | null

  @column({ columnName: 'source_id' })
  declare sourceId: number | null

  @column({ columnName: 'source_line_id' })
  declare sourceLineId: number | null

  @column({ columnName: 'reversal_of_id' })
  declare reversalOfId: number | null

  @belongsTo(() => StockMovement, { foreignKey: 'reversalOfId' })
  declare reversalOf: BelongsTo<typeof StockMovement>

  @column({ columnName: 'idempotency_key' })
  declare idempotencyKey: string | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null
}