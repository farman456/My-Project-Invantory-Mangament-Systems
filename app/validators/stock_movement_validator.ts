import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createStockMovementValidator = vine.compile(
  vine.object({
    movementDetails: vine.object({
      movementNumber: vine.string().trim().minLength(1).maxLength(150),
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
            movementType: vine.enum(['debit', 'credit']),
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
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createStockMovementValidatorInterface = Infer<typeof createStockMovementValidator>

/**
 * Partial update (PATCH) semantics.
 *
 * Every field is optional. A field is validated only when it is supplied.
 * FK lookups (`exists`) run only for the fields present in the request body.
 */
export const updateStockMovementValidator = vine.compile(
  vine.object({
    movementDetails: vine
      .object({
        movementNumber: vine.string().trim().minLength(1).maxLength(150),
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
              movementType: vine.enum(['debit', 'credit']),
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
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updateStockMovementValidatorInterface = Infer<typeof updateStockMovementValidator>

export const stockMovementIdValidator = vine.compile(
  vine.object({
    stockMovementId: vine.number().positive().withoutDecimals(),
  })
)
