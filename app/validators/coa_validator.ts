import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const idRule = vine.number().positive().withoutDecimals()
const nameRule = vine.string().trim().minLength(1).maxLength(150)
const statusRule = vine.string().trim().maxLength(20).optional()

export const createSubHeadValidator = vine.compile(
  vine.object({
    headId: idRule,
    name: nameRule,
    status: statusRule,
  })
)
export type CreateSubHeadPayload = Infer<typeof createSubHeadValidator>

export const updateSubHeadValidator = vine.compile(
  vine.object({
    headId: idRule.optional(),
    name: nameRule.optional(),
    status: statusRule,
  })
)
export type UpdateSubHeadPayload = Infer<typeof updateSubHeadValidator>

export const createAccountNameValidator = vine.compile(
  vine.object({
    headId: idRule,
    subHeadId: idRule,
    name: nameRule,
    status: statusRule,
  })
)
export type CreateAccountNamePayload = Infer<typeof createAccountNameValidator>

export const updateAccountNameValidator = vine.compile(
  vine.object({
    headId: idRule.optional(),
    subHeadId: idRule.optional(),
    name: nameRule.optional(),
    status: statusRule,
  })
)
export type UpdateAccountNamePayload = Infer<typeof updateAccountNameValidator>

export const bulkAccountNamesValidator = vine.compile(
  vine.object({
    headId: idRule,
    subHeadId: idRule,
    names: vine.array(nameRule).minLength(1).maxLength(100),
    status: statusRule,
  })
)
export type BulkAccountNamesPayload = Infer<typeof bulkAccountNamesValidator>

export const coaIdValidator = vine.compile(
  vine.object({
    headId: idRule.optional(),
    subHeadId: idRule.optional(),
    id: idRule,
  })
)
export type CoaIdPayload = Infer<typeof coaIdValidator>

export const coaQueryValidator = vine.compile(
  vine.object({
    search: vine.string().trim().optional(),
    headId: idRule.optional(),
    subHeadId: idRule.optional(),
    status: vine.string().trim().maxLength(20).optional(),
    page: vine.number().min(1).withoutDecimals().optional(),
    perPage: vine.number().min(1).withoutDecimals().max(100).optional(),
    sortBy: vine.enum(['id', 'name', 'status']).optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
    sort: vine.enum(['id', 'name', 'status']).optional(),
    order: vine.enum(['asc', 'desc']).optional(),
    investigationRequired: vine.boolean().optional(),
  })
)
export type CoaQuery = Infer<typeof coaQueryValidator>
