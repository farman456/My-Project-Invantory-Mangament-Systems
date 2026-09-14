import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AccountSubHead from '#models/account_sub_head'

export default class AccountName extends BaseModel {
  static table = 'account_names'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'account_sub_head_id' })
  declare accountSubHeadId: number

  @column()
  declare name: string

  @column()
  declare status: string

  @belongsTo(() => AccountSubHead, { foreignKey: 'accountSubHeadId' })
  declare accountSubHead: BelongsTo<typeof AccountSubHead>
}
