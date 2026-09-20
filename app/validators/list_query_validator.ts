import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const listQueryValidator = vine.compile(
  vine.object({
    search: vine.string().trim().optional(),
    status: vine.string().trim().optional(),
    sort: vine.string().trim().optional(),
    order: vine.enum(['asc', 'desc']).optional(),
    type: vine.number().positive().withoutDecimals().optional(),
    category: vine.number().positive().withoutDecimals().optional(),
    distributor: vine.number().positive().withoutDecimals().optional(),
    manufacturer: vine.number().positive().withoutDecimals().optional(),
    supplier: vine.number().positive().withoutDecimals().optional(),
    productId: vine.number().positive().withoutDecimals().optional(),
    warehouse: vine.string().trim().optional(),
    minPrice: vine.number().min(0).optional(),
    maxPrice: vine.number().min(0).optional(),
    hold: vine.number().min(0).optional(),
    total: vine.number().min(0).optional(),
  })
)

export type ListQueryOptions = Partial<Infer<typeof listQueryValidator>>

const numericFields = ['type', 'category', 'distributor', 'manufacturer', 'supplier', 'productId', 'minPrice', 'maxPrice', 'hold', 'total']

export const validateListQuery = (query: Record<string, any>) => {
  const values: Record<string, any> = {
    ...query,
    sort: query.sort ?? query.sortBy,
    order: query.order ?? query.sortOrder,
  }
  for (const field of numericFields) {
    if (values[field] !== undefined) values[field] = Number(values[field])
  }
  return listQueryValidator.validate(values)
}
