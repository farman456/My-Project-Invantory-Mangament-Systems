import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createDepartmentDesignationValidator = vine.compile(
  vine.object({
    department: vine.string().trim().minLength(1).maxLength(150),
    designation: vine.string().trim().minLength(1).maxLength(150),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createDepartmentDesignationValidatorInterface = Infer<
  typeof createDepartmentDesignationValidator
>

export const updateDepartmentDesignationValidator = vine.compile(
  vine.object({
    department: vine.string().trim().minLength(1).maxLength(150),
    designation: vine.string().trim().minLength(1).maxLength(150),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updateDepartmentDesignationValidatorInterface = Infer<
  typeof updateDepartmentDesignationValidator
>

export const updateDepartmentDesignationPatchValidator = vine.compile(
  vine.object({
    department: vine.string().trim().minLength(1).maxLength(150).optional(),
    designation: vine.string().trim().minLength(1).maxLength(150).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updateDepartmentDesignationPatchValidatorInterface = Infer<
  typeof updateDepartmentDesignationPatchValidator
>

export const departmentDesignationIdValidator = vine.compile(
  vine.object({
    departmentDesignationId: vine.number().positive().withoutDecimals(),
  })
)

export type departmentDesignationIdValidatorInterface = Infer<
  typeof departmentDesignationIdValidator
>
