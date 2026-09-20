import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { partyFields, partyPatchFields } from '#validators/party_fields'

const distributorFields = partyFields

export const createDistributorValidator = vine.compile(vine.object(distributorFields))
export type createDistributorValidatorInterface = Infer<typeof createDistributorValidator>

export const updateDistributorValidator = vine.compile(vine.object(distributorFields))
export type updateDistributorValidatorInterface = Infer<typeof updateDistributorValidator>

export const updateDistributorPatchValidator = vine.compile(
  vine.object({
    ...partyPatchFields,
  })
)
export type updateDistributorPatchValidatorInterface = Infer<
  typeof updateDistributorPatchValidator
>

export const distributorIdValidator = vine.compile(
  vine.object({ distributorId: vine.number().positive().withoutDecimals() })
)