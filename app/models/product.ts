import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/supplier'
import Type from '#models/type'

export default class Product extends BaseModel {
  static table = 'products'

  @column({ isPrimary: true })
  declare id: number

  /**
   * References the "types" table (types.id)
   */
  @column()
  declare type: number | null

  @column()
  declare name: string | null

  /**
   * Decimal(12,2). Serialize always as number to keep the API contract clean.
   */
  @column({
    serialize: (value: number | string | null) => {
      return value === null || value === undefined ? value : Number(value)
    },
  })
  declare price: number | null

  /**
   * References the "suppliers" table (suppliers.id)
   */
  @column()
  declare supplier: number | null

  @belongsTo(() => Type, { foreignKey: 'type' })
  declare typeRecord: BelongsTo<typeof Type>

  @belongsTo(() => Supplier, { foreignKey: 'supplier' })
  declare supplierRecord: BelongsTo<typeof Supplier>

  @column()
  declare status: string | null

  @column()
  declare actions: string | null
}