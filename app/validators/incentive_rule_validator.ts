import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const ruleFields = {
  ruleName: vine.string().trim().minLength(1).maxLength(150),
  status: vine.enum(['active', 'inactive']).optional(),
  calculationType: vine.enum(['percentage', 'fixed_amount', 'target_based', 'slab_based']),
  basedOn: vine.enum(['sales_amount', 'units_sold', 'gross_profit']),
  commissionRate: vine.number().min(0).optional(),
  description: vine.string().trim().maxLength(5000).optional(),
  calculationNotes: vine.string().trim().maxLength(5000).optional(),
  formulaDetails: vine.string().trim().maxLength(5000).optional(),
}

export const createIncentiveRuleValidator = vine.compile(vine.object(ruleFields))
export const updateIncentiveRuleValidator = vine.compile(vine.object(Object.fromEntries(Object.entries(ruleFields).map(([key, value]) => [key, value.optional()]))))
export const incentiveRuleIdValidator = vine.compile(vine.object({ incentiveRuleId: vine.number().positive().withoutDecimals() }))
export type IncentiveRulePayload = Infer<typeof createIncentiveRuleValidator>
export type IncentiveRuleUpdatePayload = Infer<typeof updateIncentiveRuleValidator>
