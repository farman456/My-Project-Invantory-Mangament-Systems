import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const categoryFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  contactPerson: vine.string().trim().maxLength(150).optional(),
  phone: vine.string().trim().maxLength(30).optional(),
  email: vine.string().trim().email().maxLength(150).optional(),
  areaCity: vine.string().trim().maxLength(150).optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createCategoryValidator = vine.compile(vine.object(categoryFields))
export type createCategoryValidatorInterface = Infer<typeof createCategoryValidator>

export const updateCategoryValidator = vine.compile(vine.object(categoryFields))
export type updateCategoryValidatorInterface = Infer<typeof updateCategoryValidator>

export const updateCategoryPatchValidator = vine.compile(
  vine.object({
    name: categoryFields.name.optional(),
    contactPerson: categoryFields.contactPerson,
    phone: categoryFields.phone,
    email: categoryFields.email,
    areaCity: categoryFields.areaCity,
    status: categoryFields.status,
    actions: categoryFields.actions,
  })
)
export type updateCategoryPatchValidatorInterface = Infer<typeof updateCategoryPatchValidator>

export const categoryIdValidator = vine.compile(
  vine.object({ categoryId: vine.number().positive().withoutDecimals() })
)