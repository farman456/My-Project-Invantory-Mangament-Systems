import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { partyFields, partyPatchFields } from '#validators/party_fields'

const supplierFields = {
  ...partyFields,
  email: vine.string().trim().email().maxLength(150).unique({ table: 'persons', column: 'email' }).optional(),
}

export const createSupplierValidator = vine.compile(vine.object(supplierFields))

export type createSupplierValidatorInterface = Infer<typeof createSupplierValidator>

export const updateSupplierValidator = vine.compile(vine.object(supplierFields))

export type updateSupplierValidatorInterface = Infer<typeof updateSupplierValidator>

export const updateSupplierPatchValidator = vine.compile(
  vine.object({
    ...partyPatchFields,
  })
)

export type updateSupplierPatchValidatorInterface = Infer<typeof updateSupplierPatchValidator>

export const supplierIdValidator = vine.compile(
  vine.object({
    supplierId: vine.number().positive().withoutDecimals(),
  })
)
