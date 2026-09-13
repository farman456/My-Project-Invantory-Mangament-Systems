import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const distributorFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  contactPerson: vine.string().trim().maxLength(150).optional(),
  phone: vine.string().trim().maxLength(30).optional(),
  email: vine.string().trim().email().maxLength(150).optional(),
  areaCity: vine.string().trim().maxLength(150).optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createDistributorValidator = vine.compile(vine.object(distributorFields))
export type createDistributorValidatorInterface = Infer<typeof createDistributorValidator>

export const updateDistributorValidator = vine.compile(vine.object(distributorFields))
export type updateDistributorValidatorInterface = Infer<typeof updateDistributorValidator>

export const updateDistributorPatchValidator = vine.compile(
  vine.object({
    name: distributorFields.name.optional(),
    contactPerson: distributorFields.contactPerson,
    phone: distributorFields.phone,
    email: distributorFields.email,
    areaCity: distributorFields.areaCity,
    status: distributorFields.status,
    actions: distributorFields.actions,
  })
)
export type updateDistributorPatchValidatorInterface = Infer<
  typeof updateDistributorPatchValidator
>

export const distributorIdValidator = vine.compile(
  vine.object({ distributorId: vine.number().positive().withoutDecimals() })
)