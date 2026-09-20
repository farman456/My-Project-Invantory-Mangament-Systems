import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Salary extends BaseModel {
  static table = 'salaries'
  @column({ isPrimary: true }) declare id: number
  @column() declare salaryMonth: string
  @column() declare staffId: number | null
  @column() declare salaryHeads: Record<string, unknown>[]
  @column() declare salaryValue: number
  @column() declare status: string
  @column() declare actions: string | null
  @belongsTo(() => User, { foreignKey: 'staffId' }) declare staff: BelongsTo<typeof User>
}
