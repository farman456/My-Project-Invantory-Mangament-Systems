import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createSupplierValidator = vine.compile(
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

export type createSupplierValidatorInterface = Infer<typeof createSupplierValidator>

export const updateSupplierValidator = vine.compile(
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

export type updateSupplierValidatorInterface = Infer<typeof updateSupplierValidator>

export const supplierIdValidator = vine.compile(
  vine.object({
    supplierId: vine.number().positive().withoutDecimals(),
  })
)
