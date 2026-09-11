import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const paginationValidator = vine.compile(
  vine.object({
    page: vine.number().min(1).withoutDecimals().optional(),
    pageSize: vine.number().min(1).withoutDecimals().max(100).optional(),
    filters: vine
      .array(
        vine.object({
          columnName: vine.string().trim().optional(),
          type: vine.string().trim().optional(),
          value: vine.unionOfTypes([vine.string(), vine.number()]),
        })
      )
      .optional(),
    sorts: vine
      .array(
        vine.object({
          columnName: vine.string().trim(),
          orderBy: vine.string().trim(),
        })
      )
      .optional(),
  })
)

export type paginationValidatorInterface = Infer<typeof paginationValidator>
