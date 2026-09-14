import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AccountSubHead from '#models/account_sub_head'

export default class AccountHead extends BaseModel {
  static table = 'account_heads'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare status: string

  @hasMany(() => AccountSubHead, { foreignKey: 'accountHeadId' })
  declare subHeads: HasMany<typeof AccountSubHead>
}
