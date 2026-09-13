import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const manufacturerFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  contactPerson: vine.string().trim().maxLength(150).optional(),
  phone: vine.string().trim().maxLength(30).optional(),
  email: vine.string().trim().email().maxLength(150).optional(),
  areaCity: vine.string().trim().maxLength(150).optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createManufacturerValidator = vine.compile(vine.object(manufacturerFields))
export type createManufacturerValidatorInterface = Infer<typeof createManufacturerValidator>

export const updateManufacturerValidator = vine.compile(vine.object(manufacturerFields))
export type updateManufacturerValidatorInterface = Infer<typeof updateManufacturerValidator>

export const updateManufacturerPatchValidator = vine.compile(
  vine.object({
    name: manufacturerFields.name.optional(),
    contactPerson: manufacturerFields.contactPerson,
    phone: manufacturerFields.phone,
    email: manufacturerFields.email,
    areaCity: manufacturerFields.areaCity,
    status: manufacturerFields.status,
    actions: manufacturerFields.actions,
  })
)
export type updateManufacturerPatchValidatorInterface = Infer<
  typeof updateManufacturerPatchValidator
>

export const manufacturerIdValidator = vine.compile(
  vine.object({ manufacturerId: vine.number().positive().withoutDecimals() })
)