import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Person from '#models/person'
import Product from '#models/product'

export default class Distributor extends BaseModel {
  static table = 'distributors'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'person_id' })
  declare personId: number | null

  @belongsTo(() => Person, { foreignKey: 'personId' })
  declare person: BelongsTo<typeof Person>

  @hasMany(() => Product, { foreignKey: 'distributorId' })
  declare products: HasMany<typeof Product>
}
