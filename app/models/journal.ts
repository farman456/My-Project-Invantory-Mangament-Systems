import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import JournalLine from '#models/journal_line'

export default class Journal extends BaseModel {
  static table = 'journals'
  @column({ isPrimary: true }) declare id: number
  @column() declare journalNumber: string
  @column() declare journalDate: string
  @column() declare journalType: string
  @column() declare transactionType: string
  @column() declare partyHeads: string | null
  @column() declare description: string | null
  @column() declare status: string
  @hasMany(() => JournalLine, { foreignKey: 'journalId' }) declare lines: HasMany<typeof JournalLine>
}
