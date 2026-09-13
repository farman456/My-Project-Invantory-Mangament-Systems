import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createPersonMasterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    contactPerson: vine.string().trim().maxLength(150).optional(),
    phone: vine.string().trim().maxLength(30).optional(),
    email: vine.string().trim().email().maxLength(150).optional(),
    areaCity: vine.string().trim().maxLength(150).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createPersonMasterValidatorInterface = Infer<typeof createPersonMasterValidator>

export const updatePersonMasterValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    contactPerson: vine.string().trim().maxLength(150).optional(),
    phone: vine.string().trim().maxLength(30).optional(),
    email: vine.string().trim().email().maxLength(150).optional(),
    areaCity: vine.string().trim().maxLength(150).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updatePersonMasterValidatorInterface = Infer<typeof updatePersonMasterValidator>

export const updatePersonMasterPatchValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    contactPerson: vine.string().trim().maxLength(150).optional(),
    phone: vine.string().trim().maxLength(30).optional(),
    email: vine.string().trim().email().maxLength(150).optional(),
    areaCity: vine.string().trim().maxLength(150).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updatePersonMasterPatchValidatorInterface = Infer<
  typeof updatePersonMasterPatchValidator
>

export const personMasterIdValidator = vine.compile(
  vine.object({
    personMasterId: vine.number().positive().withoutDecimals(),
  })
)

export type personMasterIdValidatorInterface = Infer<typeof personMasterIdValidator>
