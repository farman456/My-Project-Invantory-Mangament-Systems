import User from '#models/user'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3).maxLength(150).trim(),
    email: vine.string().email().trim().unique({
      table: User.table,
      column: 'email',
    }),
    password: vine.string().trim(),
    role_id: vine.number().positive().withoutDecimals().exists({ table: 'roles', column: 'id' }),
  })
)

export type createUserValidatorInterface = Infer<typeof createUserValidator>

/**
 * Partial update (PATCH) semantics.
 *
 * Every field is optional. A field is validated only when it is supplied.
 * The `role_id` FK lookup runs only when `role_id` is present in the body.
 */
export const updateUserValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .unique(async (db, value, field) => {
        const user = await db
          .from(User.table)
          .where('email', value)
          .whereNot('id', field.meta.userId)
          .first()

        // we check if the incoming email is not already exists with other ids, if not exists then we allow to change the email
        return !user
      })
      .optional(),
    name: vine.string().minLength(3).maxLength(150).trim().optional(),
    role_id: vine
      .number()
      .positive()
      .withoutDecimals()
      .exists({ table: 'roles', column: 'id' })
      .optional(),
    status: vine.string().trim().maxLength(20).optional(),
  })
)
export type updateUserValidatorInterface = Infer<typeof updateUserValidator>

export const userIdValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
  })
)
export type userIdValidatorInterface = Infer<typeof userIdValidator>
