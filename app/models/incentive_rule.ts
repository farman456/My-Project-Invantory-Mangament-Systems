import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import IncentiveSchema from '#models/incentive_schema'

export default class IncentiveRule extends BaseModel {
  static table = 'incentive_rules'

  @column({ isPrimary: true }) declare id: number
  @column() declare ruleName: string
  @column() declare status: string
  @column() declare calculationType: string
  @column() declare basedOn: string
  @column() declare commissionRate: number | null
  @column() declare description: string | null
  @column() declare calculationNotes: string | null
  @column() declare formulaDetails: string | null
  @hasMany(() => IncentiveSchema, { foreignKey: 'ruleId' }) declare schemas: HasMany<typeof IncentiveSchema>
}
