import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Journal from '#models/journal'
import AccountHead from '#models/account_head'
import AccountSubHead from '#models/account_sub_head'

export default class JournalLine extends BaseModel {
  static table = 'journal_lines'
  @column({ isPrimary: true }) declare id: number
  @column() declare journalId: number
  @column() declare accountHeadId: number
  @column({ columnName: 'account_sub_head_id' }) declare accountSubHeadId: number
  @column() declare narration: string | null
  @column() declare debit: number
  @column() declare credit: number
  @belongsTo(() => Journal, { foreignKey: 'journalId' }) declare journal: BelongsTo<typeof Journal>
  @belongsTo(() => AccountHead, { foreignKey: 'accountHeadId' }) declare accountHead: BelongsTo<typeof AccountHead>
  @belongsTo(() => AccountSubHead, { foreignKey: 'accountSubHeadId' }) declare accountSubHead: BelongsTo<typeof AccountSubHead>
}
