import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Person from '#models/person'
import Product from '#models/product'
import StockMovement from '#models/stock_movement'
import ExpiryDamage from '#models/expiry_damage'
import BatchHolding from '#models/batch_holding'
import InventoryLevel from '#models/inventory_level'

export default class Supplier extends BaseModel {
  static table = 'suppliers'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare personId: number | null

  @belongsTo(() => Person, { foreignKey: 'personId' })
  declare person: BelongsTo<typeof Person>

  @hasMany(() => Product, { foreignKey: 'supplierId' })
  declare products: HasMany<typeof Product>

  @hasMany(() => StockMovement, { foreignKey: 'supplier' })
  declare stockMovements: HasMany<typeof StockMovement>

  @hasMany(() => ExpiryDamage, { foreignKey: 'supplier' })
  declare expiryDamages: HasMany<typeof ExpiryDamage>

  @hasMany(() => BatchHolding, { foreignKey: 'supplier' })
  declare batchHoldings: HasMany<typeof BatchHolding>

  @hasMany(() => InventoryLevel, { foreignKey: 'supplier' })
  declare inventoryLevels: HasMany<typeof InventoryLevel>
}