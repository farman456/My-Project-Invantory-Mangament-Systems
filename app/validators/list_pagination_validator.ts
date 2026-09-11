import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const listPaginationValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).withoutDecimals().optional(),
    perPage: vine.number().min(1).withoutDecimals().max(100).optional(),
  })
)

export type listPaginationValidatorInterface = Infer<typeof listPaginationValidator>
