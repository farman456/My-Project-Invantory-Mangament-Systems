import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class RecycleBin extends BaseModel {
  static table = 'recycle_bin'

  @column({ isPrimary: true }) declare id: number
  @column() declare source: string
  @column() declare recordId: number
  @column.dateTime() declare deletedAt: DateTime
  @column() declare deletedBy: number | null
  @column() declare record: Record<string, unknown>
}
