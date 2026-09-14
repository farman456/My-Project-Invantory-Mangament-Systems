import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    investigationRequired: vine.boolean().optional(),
  })
)

export type createTypeValidatorInterface = Infer<typeof createTypeValidator>

export const updateTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    investigationRequired: vine.boolean().optional(),
  })
)

export type updateTypeValidatorInterface = Infer<typeof updateTypeValidator>

export const updateTypePatchValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    investigationRequired: vine.boolean().optional(),
  })
)

export type updateTypePatchValidatorInterface = Infer<typeof updateTypePatchValidator>

export const typeListQueryValidator = vine.compile(
  vine.object({
    investigationRequired: vine.boolean().optional(),
  })
)

export type typeListQueryValidatorInterface = Infer<typeof typeListQueryValidator>

export const typeIdValidator = vine.compile(
  vine.object({
    typeId: vine.number().positive().withoutDecimals(),
  })
)

export type typeIdValidatorInterface = Infer<typeof typeIdValidator>
