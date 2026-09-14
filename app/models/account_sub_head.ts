import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import AccountHead from '#models/account_head'
import AccountName from '#models/account_name'

export default class AccountSubHead extends BaseModel {
  static table = 'account_sub_heads'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'account_head_id' })
  declare accountHeadId: number

  @column()
  declare name: string

  @column()
  declare status: string

  @belongsTo(() => AccountHead, { foreignKey: 'accountHeadId' })
  declare accountHead: BelongsTo<typeof AccountHead>

  @hasMany(() => AccountName, { foreignKey: 'accountSubHeadId' })
  declare names: HasMany<typeof AccountName>
}
