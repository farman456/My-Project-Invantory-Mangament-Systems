import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const customerFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  contactPerson: vine.string().trim().maxLength(150).optional(),
  phone: vine.string().trim().maxLength(30).optional(),
  email: vine.string().trim().email().maxLength(150).optional(),
  areaCity: vine.string().trim().maxLength(150).optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createCustomerValidator = vine.compile(vine.object(customerFields))

export type createCustomerValidatorInterface = Infer<typeof createCustomerValidator>

export const updateCustomerValidator = vine.compile(vine.object(customerFields))

export type updateCustomerValidatorInterface = Infer<typeof updateCustomerValidator>

export const updateCustomerPatchValidator = vine.compile(
  vine.object({
    name: customerFields.name.optional(),
    contactPerson: customerFields.contactPerson,
    phone: customerFields.phone,
    email: customerFields.email,
    areaCity: customerFields.areaCity,
    status: customerFields.status,
    actions: customerFields.actions,
  })
)

export type updateCustomerPatchValidatorInterface = Infer<typeof updateCustomerPatchValidator>

export const customerIdValidator = vine.compile(
  vine.object({
    customerId: vine.number().positive().withoutDecimals(),
  })
)