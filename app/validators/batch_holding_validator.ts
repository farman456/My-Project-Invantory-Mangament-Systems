import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createBatchHoldingValidator = vine.compile(
  vine.object({
    batchDetails: vine.object({
      holdingNumber: vine.string().trim().minLength(1).maxLength(150),
      date: vine.date({ formats: ['YYYY-MM-DD'] }),
      items: vine
        .array(
          vine.object({
            productId: vine
              .number()
              .positive()
              .withoutDecimals()
              .exists({ table: 'products', column: 'id' }),
            quantity: vine.number().positive(),
            holdingType: vine.enum(['hold', 'released']),
          })
        )
        .minLength(1),
    }),
    supplier: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' }),
    type: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'types', column: 'id' })
      .optional(),
    status: vine.string().trim().maxLength(20).optional(),
    action: vine.string().trim().maxLength(50).optional(),
  })
)

export type createBatchHoldingValidatorInterface = Infer<typeof createBatchHoldingValidator>

/**
 * Partial update (PATCH) semantics.
 *
 * Every field is optional. A field is validated only when it is supplied.
 * FK lookups (`exists`) run only for the fields present in the request body.
 */
export const updateBatchHoldingValidator = vine.compile(
  vine.object({
    batchDetails: vine
      .object({
        holdingNumber: vine.string().trim().minLength(1).maxLength(150),
        date: vine.date({ formats: ['YYYY-MM-DD'] }),
        items: vine
          .array(
            vine.object({
              productId: vine
                .number()
                .positive()
                .withoutDecimals()
                .exists({ table: 'products', column: 'id' }),
              quantity: vine.number().positive(),
              holdingType: vine.enum(['hold', 'released']),
            })
          )
          .minLength(1),
      })
      .optional(),
    supplier: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' })
      .optional(),
    type: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'types', column: 'id' })
      .optional(),
    status: vine.string().trim().maxLength(20).optional(),
    action: vine.string().trim().maxLength(50).optional(),
  })
)

export type updateBatchHoldingValidatorInterface = Infer<typeof updateBatchHoldingValidator>

export const batchHoldingIdValidator = vine.compile(
  vine.object({
    batchHoldingId: vine.number().positive().withoutDecimals(),
  })
)
