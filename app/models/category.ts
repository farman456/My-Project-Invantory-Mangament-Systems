import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Person from '#models/person'

export default class Category extends BaseModel {
  static table = 'categories'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'person_id' })
  declare personId: number | null

  @belongsTo(() => Person, { foreignKey: 'personId' })
  declare person: BelongsTo<typeof Person>
}
