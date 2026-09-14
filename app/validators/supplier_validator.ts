import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const supplierFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  contactPerson: vine.string().trim().maxLength(150).optional(),
  phone: vine.string().trim().maxLength(30).optional(),
  email: vine.string().trim().email().maxLength(150).optional(),
  areaCity: vine.string().trim().maxLength(150).optional(),
  status: vine.string().trim().maxLength(20).optional(),
  actions: vine.string().trim().maxLength(50).optional(),
}

export const createSupplierValidator = vine.compile(vine.object(supplierFields))

export type createSupplierValidatorInterface = Infer<typeof createSupplierValidator>

export const updateSupplierValidator = vine.compile(vine.object(supplierFields))

export type updateSupplierValidatorInterface = Infer<typeof updateSupplierValidator>

export const updateSupplierPatchValidator = vine.compile(
  vine.object({
    name: supplierFields.name.optional(),
    contactPerson: supplierFields.contactPerson,
    phone: supplierFields.phone,
    email: supplierFields.email,
    areaCity: supplierFields.areaCity,
    status: supplierFields.status,
    actions: supplierFields.actions,
  })
)

export type updateSupplierPatchValidatorInterface = Infer<typeof updateSupplierPatchValidator>

export const supplierIdValidator = vine.compile(
  vine.object({
    supplierId: vine.number().positive().withoutDecimals(),
  })
)
