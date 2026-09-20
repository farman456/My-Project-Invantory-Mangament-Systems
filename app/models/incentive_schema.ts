import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import IncentiveRule from '#models/incentive_rule'

export default class IncentiveSchema extends BaseModel {
  static table = 'incentive_schemas'

  @column({ isPrimary: true }) declare id: number
  @column() declare schemaName: string
  @column() declare periodCycle: string
  @column() declare salesTargetBenchmark: number
  @column() declare ruleId: number
  @column() declare applicableTo: string
  @column() declare targetDepartment: string | null
  @column() declare effectiveFrom: string
  @column() declare effectiveTo: string | null
  @column() declare status: string
  @column() declare description: string | null
  @column() declare incentiveTerms: string | null
  @belongsTo(() => IncentiveRule, { foreignKey: 'ruleId' }) declare rule: BelongsTo<typeof IncentiveRule>
}
