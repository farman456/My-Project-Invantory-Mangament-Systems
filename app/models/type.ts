import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Product from '#models/product'

/**
 * Dropdown data source for the "type" field of a product.
 *
 * NOTE: The underlying "types" table is owned by the Type module and is
 * assumed to exist (created separately). This model only needs the "id" and
 * "name" columns to power the product dropdown endpoints.
 */
export default class Type extends BaseModel {
  static table = 'types'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @hasMany(() => Product, { foreignKey: 'type' })
  declare products: HasMany<typeof Product>
}