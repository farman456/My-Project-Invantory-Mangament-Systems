import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { partyFields, partyPatchFields } from '#validators/party_fields'

const manufacturerFields = partyFields

export const createManufacturerValidator = vine.compile(vine.object(manufacturerFields))
export type createManufacturerValidatorInterface = Infer<typeof createManufacturerValidator>

export const updateManufacturerValidator = vine.compile(vine.object(manufacturerFields))
export type updateManufacturerValidatorInterface = Infer<typeof updateManufacturerValidator>

export const updateManufacturerPatchValidator = vine.compile(
  vine.object({
    ...partyPatchFields,
  })
)
export type updateManufacturerPatchValidatorInterface = Infer<
  typeof updateManufacturerPatchValidator
>

export const manufacturerIdValidator = vine.compile(
  vine.object({ manufacturerId: vine.number().positive().withoutDecimals() })
)