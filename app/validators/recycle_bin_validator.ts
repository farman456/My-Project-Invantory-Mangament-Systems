import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const recycleBinIdValidator = vine.compile(vine.object({ id: vine.number().positive().withoutDecimals() }))
export type RecycleBinId = Infer<typeof recycleBinIdValidator>
