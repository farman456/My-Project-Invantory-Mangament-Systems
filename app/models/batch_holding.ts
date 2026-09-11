import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import Type from '#models/type'

export default class BatchHolding extends BaseModel {
  static table = 'batch_holdings'

  @column({ isPrimary: true })
  declare id: number

  @column({
    serialize: (value: string | null) => (value ? JSON.parse(value) : value),
  })
  declare batchDetails: string | null

  @column()
  declare supplier: number | null

  @column()
  declare type: number | null

  @belongsTo(() => Supplier, { foreignKey: 'supplier' })
  declare supplierRecord: BelongsTo<typeof Supplier>

  @belongsTo(() => Type, { foreignKey: 'type' })
  declare typeRecord: BelongsTo<typeof Type>

  @column()
  declare status: string | null

  @column()
  declare action: string | null
}