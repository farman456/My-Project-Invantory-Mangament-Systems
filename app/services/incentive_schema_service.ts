import IncentiveSchema from '#models/incentive_schema'
import type { IncentiveSchemaPayload, IncentiveSchemaUpdatePayload } from '#validators/incentive_schema_validator'

export const listIncentiveSchemas = () => IncentiveSchema.query().preload('rule').orderBy('id', 'desc')

export const createIncentiveSchema = (payload: IncentiveSchemaPayload) => IncentiveSchema.create({ ...payload, status: payload.status ?? 'active' })

export const getIncentiveSchema = async (id: number) => {
  const item = await IncentiveSchema.query().where('id', id).preload('rule').first()
  if (!item) throw new Error(`Incentive schema with ID: ${id} does not exist`)
  return item
}

export const updateIncentiveSchema = async (id: number, payload: IncentiveSchemaUpdatePayload) => {
  const item = await getIncentiveSchema(id)
  return item.merge(payload).save()
}

export const deleteIncentiveSchema = async (id: number) => {
  const item = await getIncentiveSchema(id)
  await item.delete()
}
