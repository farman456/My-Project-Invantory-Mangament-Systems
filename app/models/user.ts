import { DateTime } from 'luxon'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, beforeFetch, beforeFind, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { softDeleteQuery, softDeleteUser } from '#helpers/soft_delete_helper'
import Person from '#models/person'
import Role from '#models/role'
import DepartmentDesignation from '#models/department_designation'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export const userFilterEnum = ['id', 'name', 'email', 'status']
export const userSortEnum = ['id', 'name', 'email', 'status']

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'users'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare personId: number | null

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare roleId: number

  @column()
  declare roleType: string | null

  @column()
  declare designationId: number | null

  @column()
  declare status: string

  @column()
  declare action: string | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: null })
  declare deletedAt: DateTime

  @belongsTo(() => Person, { foreignKey: 'personId' })
  declare person: BelongsTo<typeof Person>

  @belongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => DepartmentDesignation, { foreignKey: 'designationId' })
  declare designation: BelongsTo<typeof DepartmentDesignation>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
  })

  @beforeFind()
  public static softDeletesFind = softDeleteQuery

  @beforeFetch()
  public static softDeletesFetch = softDeleteQuery

  public async softDelete() {
    await softDeleteUser(this)
  }
}
