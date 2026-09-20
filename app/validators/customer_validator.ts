import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { partyFields, partyPatchFields } from '#validators/party_fields'

const customerFields = {
  ...partyFields,
  email: vine.string().trim().email().maxLength(150).unique({ table: 'persons', column: 'email' }).optional(),
}

export const createCustomerValidator = vine.compile(vine.object(customerFields))

export type createCustomerValidatorInterface = Infer<typeof createCustomerValidator>

export const updateCustomerValidator = vine.compile(vine.object(customerFields))

export type updateCustomerValidatorInterface = Infer<typeof updateCustomerValidator>

export const updateCustomerPatchValidator = vine.compile(
  vine.object({
    ...partyPatchFields,
  })
)

export type updateCustomerPatchValidatorInterface = Infer<typeof updateCustomerPatchValidator>

export const customerIdValidator = vine.compile(
  vine.object({
    customerId: vine.number().positive().withoutDecimals(),
  })
)