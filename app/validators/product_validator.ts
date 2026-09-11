import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createProductValidator = vine.compile(
  vine.object({
    /**
     * Required to create the actual product record (products.name varchar(150))
     */
    name: vine.string().trim().minLength(1).maxLength(150),
    /**
     * Products.type references types.id
     */
    type: vine.number().positive().withoutDecimals().exists({ table: 'types', column: 'id' }),
    /**
     * Products.supplier references suppliers.id
     */
    supplier: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' }),
    /**
     * Products.price decimal(12,2) - non-negative numeric value
     */
    price: vine.number().min(0).max(9999999999.99),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type createProductValidatorInterface = Infer<typeof createProductValidator>

/**
 * Full update (PUT) semantics.
 *
 * The core product fields (`name`, `type`, `supplier`, `price`) are required
 * so a PUT represents a complete replacement. `status` and `actions` remain
 * optional since they are not core product data.
 */
export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150),
    type: vine.number().positive().withoutDecimals().exists({ table: 'types', column: 'id' }),
    supplier: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' }),
    price: vine.number().min(0).max(9999999999.99),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updateProductValidatorInterface = Infer<typeof updateProductValidator>

export const updateProductPatchValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(150).optional(),
    type: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'types', column: 'id' })
      .optional(),
    supplier: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'suppliers', column: 'id' })
      .optional(),
    price: vine.number().min(0).max(9999999999.99).optional(),
    status: vine.string().trim().maxLength(20).optional(),
    actions: vine.string().trim().maxLength(50).optional(),
  })
)

export type updateProductPatchValidatorInterface = Infer<typeof updateProductPatchValidator>

export const productIdValidator = vine.compile(
  vine.object({
    productId: vine.number().positive().withoutDecimals(),
  })
)

export type productIdValidatorInterface = Infer<typeof productIdValidator>
