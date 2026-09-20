import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Category from '#models/category'
import Distributor from '#models/distributor'
import Manufacturer from '#models/manufacturer'
import Supplier from '#models/supplier'
import Type from '#models/type'

export default class Product extends BaseModel {
  static table = 'products'

  @column({ isPrimary: true })
  declare id: number

  /**
   * References the "types" table (types.id)
   */
  @column({ columnName: 'type_id', serializeAs: 'type' })
  declare typeId: number | null

  /**
   * References the "categories" table (categories.id)
   */
  @column({ columnName: 'category_id', serializeAs: 'category' })
  declare categoryId: number | null

  /**
   * References the "distributors" table (distributors.id)
   */
  @column({ columnName: 'distributor_id', serializeAs: 'distributor' })
  declare distributorId: number | null

  /**
   * References the "manufacturers" table (manufacturers.id)
   */
  @column({ columnName: 'manufacturer_id', serializeAs: 'manufacturer' })
  declare manufacturerId: number | null

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
  @column({ columnName: 'supplier_id', serializeAs: 'supplier' })
  declare supplierId: number | null

  @belongsTo(() => Type, { foreignKey: 'typeId' })
  declare typeRecord: BelongsTo<typeof Type>

  @belongsTo(() => Category, { foreignKey: 'categoryId' })
  declare categoryRecord: BelongsTo<typeof Category>

  @belongsTo(() => Distributor, { foreignKey: 'distributorId' })
  declare distributorRecord: BelongsTo<typeof Distributor>

  @belongsTo(() => Manufacturer, { foreignKey: 'manufacturerId' })
  declare manufacturerRecord: BelongsTo<typeof Manufacturer>

  @belongsTo(() => Supplier, { foreignKey: 'supplierId' })
  declare supplierRecord: BelongsTo<typeof Supplier>

  @column()
  declare status: string | null

  @column()
  declare actions: string | null
}