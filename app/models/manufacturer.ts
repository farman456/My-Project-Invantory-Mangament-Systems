import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Person from '#models/person'
import Product from '#models/product'

export default class Manufacturer extends BaseModel {
  static table = 'manufacturers'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'person_id' })
  declare personId: number | null

  @belongsTo(() => Person, { foreignKey: 'personId' })
  declare person: BelongsTo<typeof Person>

  @hasMany(() => Product, { foreignKey: 'manufacturerId' })
  declare products: HasMany<typeof Product>
}
