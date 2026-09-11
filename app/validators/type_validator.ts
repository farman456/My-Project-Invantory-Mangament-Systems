import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
  })
)

export type createTypeValidatorInterface = Infer<typeof createTypeValidator>

export const updateTypeValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
  })
)

export type updateTypeValidatorInterface = Infer<typeof updateTypeValidator>

export const typeIdValidator = vine.compile(
  vine.object({
    typeId: vine.number().positive().withoutDecimals(),
  })
)

export type typeIdValidatorInterface = Infer<typeof typeIdValidator>
