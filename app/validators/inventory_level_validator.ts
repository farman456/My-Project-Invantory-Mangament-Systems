import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const inventoryLevelIdValidator = vine.compile(
  vine.object({
    inventoryLevelId: vine.number().positive().withoutDecimals(),
  })
)

export type inventoryLevelIdValidatorInterface = Infer<typeof inventoryLevelIdValidator>
