import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Role extends BaseModel {
  static table = 'roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleName: string

  @column()
  declare description: string | null

  @column()
  declare status: string

  @column()
  declare action: string | null

  @hasMany(() => User, { foreignKey: 'roleId' })
  declare users: HasMany<typeof User>
}
