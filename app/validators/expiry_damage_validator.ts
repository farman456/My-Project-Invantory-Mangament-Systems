import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createExpiryDamageValidator = vine.compile(
  vine.object({
    edDetails: vine.object({
      recordNumber: vine.string().trim().minLength(1).maxLength(150),
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
            itemType: vine.enum(['expired', 'damaged']),
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

export type createExpiryDamageValidatorInterface = Infer<typeof createExpiryDamageValidator>

/**
 * Partial update (PATCH) semantics.
 *
 * Every field is optional. A field is validated only when it is supplied.
 * FK lookups (`exists`) run only for the fields present in the request body.
 */
export const updateExpiryDamageValidator = vine.compile(
  vine.object({
    edDetails: vine
      .object({
        recordNumber: vine.string().trim().minLength(1).maxLength(150),
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
              itemType: vine.enum(['expired', 'damaged']),
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

export type updateExpiryDamageValidatorInterface = Infer<typeof updateExpiryDamageValidator>

export const expiryDamageIdValidator = vine.compile(
  vine.object({
    expiryDamageId: vine.number().positive().withoutDecimals(),
  })
)
