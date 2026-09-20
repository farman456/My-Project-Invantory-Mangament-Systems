import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const inventoryLevelIdValidator = vine.compile(
  vine.object({
    inventoryLevelId: vine.number().positive().withoutDecimals(),
  })
)

export type inventoryLevelIdValidatorInterface = Infer<typeof inventoryLevelIdValidator>

const inventoryLevelFields = {
  name: vine.string().trim().minLength(1).maxLength(150),
  supplier: vine.number().positive().withoutDecimals().exists({ table: 'suppliers', column: 'id' }).optional(),
  warehouse: vine.string().trim().minLength(1).maxLength(150),
  hold: vine.number().min(0).withoutDecimals(),
  total: vine.number().min(0).withoutDecimals(),
}

export const createInventoryLevelValidator = vine.compile(vine.object(inventoryLevelFields))
export const updateInventoryLevelValidator = vine.compile(
  vine.object(Object.fromEntries(Object.entries(inventoryLevelFields).map(([key, value]) => [key, value.optional()])))
)
export type InventoryLevelPayload = Infer<typeof createInventoryLevelValidator>
export type InventoryLevelUpdatePayload = Infer<typeof updateInventoryLevelValidator>
