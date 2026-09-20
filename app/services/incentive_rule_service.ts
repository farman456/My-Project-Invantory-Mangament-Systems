import IncentiveRule from '#models/incentive_rule'
import type { IncentiveRulePayload, IncentiveRuleUpdatePayload } from '#validators/incentive_rule_validator'

export const listIncentiveRules = () => IncentiveRule.query().preload('schemas').orderBy('id', 'desc')

export const createIncentiveRule = (payload: IncentiveRulePayload) => IncentiveRule.create({ ...payload, status: payload.status ?? 'active' })

export const getIncentiveRule = async (id: number) => {
  const item = await IncentiveRule.query().where('id', id).preload('schemas').first()
  if (!item) throw new Error(`Incentive rule with ID: ${id} does not exist`)
  return item
}

export const updateIncentiveRule = async (id: number, payload: IncentiveRuleUpdatePayload) => {
  const item = await getIncentiveRule(id)
  return item.merge(payload).save()
}

export const deleteIncentiveRule = async (id: number) => {
  const item = await getIncentiveRule(id)
  await item.delete()
}
