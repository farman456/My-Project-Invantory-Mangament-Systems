import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { STAFF_PERMISSION_ACCESS_TYPES } from '#helpers/staff_permission_catalog'

const permission = vine.object({
  module: vine.string().trim().minLength(1).maxLength(50),
  feature: vine.string().trim().minLength(1).maxLength(80),
  accessType: vine.enum(STAFF_PERMISSION_ACCESS_TYPES),
  compulsory: vine.boolean().optional(),
})

export const createStaffAssignmentValidator = vine.compile(vine.object({
  staffId: vine.number().positive().withoutDecimals(),
  designationId: vine.number().positive().withoutDecimals(),
  permissions: vine.array(permission).optional(),
}))

export const updateStaffAssignmentValidator = vine.compile(vine.object({
  designationId: vine.number().positive().withoutDecimals(),
  permissions: vine.array(permission).optional(),
}))

export const staffAssignmentIdValidator = vine.compile(vine.object({
  staffId: vine.number().positive().withoutDecimals(),
}))

export type StaffAssignmentPayload = Infer<typeof createStaffAssignmentValidator>
export type StaffAssignmentUpdatePayload = Infer<typeof updateStaffAssignmentValidator>
