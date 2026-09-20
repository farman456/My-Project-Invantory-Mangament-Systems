import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const schemaFields = {
  schemaName: vine.string().trim().minLength(1).maxLength(150),
  periodCycle: vine.enum(['monthly', 'quarterly', 'annual', 'yearly']),
  salesTargetBenchmark: vine.number().min(0),
  ruleId: vine.number().positive().withoutDecimals().exists({ table: 'incentive_rules', column: 'id' }),
  applicableTo: vine.enum(['all_employees', 'department_wise', 'designation_wise', 'specific_staff_members']),
  targetDepartment: vine.string().trim().maxLength(150).optional(),
  effectiveFrom: vine.date({ formats: ['YYYY-MM-DD'] }),
  effectiveTo: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
  status: vine.enum(['active', 'inactive']).optional(),
  description: vine.string().trim().maxLength(5000).optional(),
  incentiveTerms: vine.string().trim().maxLength(5000).optional(),
}

export const createIncentiveSchemaValidator = vine.compile(vine.object(schemaFields))
export const updateIncentiveSchemaValidator = vine.compile(vine.object(Object.fromEntries(Object.entries(schemaFields).map(([key, value]) => [key, value.optional()]))))
export const incentiveSchemaIdValidator = vine.compile(vine.object({ incentiveSchemaId: vine.number().positive().withoutDecimals() }))
export type IncentiveSchemaPayload = Infer<typeof createIncentiveSchemaValidator>
export type IncentiveSchemaUpdatePayload = Infer<typeof updateIncentiveSchemaValidator>
