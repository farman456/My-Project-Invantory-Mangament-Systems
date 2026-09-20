import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import DepartmentDesignation from '#models/department_designation'
import StaffPermission from '#models/staff_permission'
import { BASIC_STAFF_PERMISSIONS, STAFF_PERMISSION_CATALOG } from '#helpers/staff_permission_catalog'
import type { StaffAssignmentPayload } from '#validators/staff_assignment_validator'

const validationError = (message: string) => {
  const exception = new Error(message) as Error & { code: string; messages: unknown[] }
  exception.code = 'E_VALIDATION_ERROR'
  exception.messages = [{ message, rule: 'staff_assignment', field: 'permissions' }]
  return exception
}

const normalizedPermissions = (permissions: StaffAssignmentPayload['permissions']) => {
  if (!permissions || permissions.length === 0) return [...BASIC_STAFF_PERMISSIONS]
  const seen = new Set<string>()
  for (const permission of permissions) {
    const key = `${permission.module}:${permission.feature}`
    if (seen.has(key)) throw validationError(`Duplicate permission: ${key}`)
    seen.add(key)
    const valid = STAFF_PERMISSION_CATALOG.some(([module, feature]) => module === permission.module && feature === permission.feature)
    const basic = BASIC_STAFF_PERMISSIONS.some((item) => item.module === permission.module && item.feature === permission.feature)
    if (!valid && !basic) throw validationError(`Invalid permission: ${key}`)
  }
  return permissions
}

export const saveStaffAssignment = async (payload: StaffAssignmentPayload) => {
  const staff = await User.find(payload.staffId)
  if (!staff) throw validationError(`Staff with ID: ${payload.staffId} does not exist`)
  const designation = await DepartmentDesignation.find(payload.designationId)
  if (!designation) throw validationError(`Designation with ID: ${payload.designationId} does not exist`)
  const permissions = normalizedPermissions(payload.permissions)
  const transaction = await db.transaction()
  try {
    await transaction.from('users').where('id', payload.staffId).update({ designation_id: payload.designationId })
    await transaction.from('designation_permissions').where('designation_id', payload.designationId).delete()
    await transaction.table('designation_permissions').multiInsert(permissions.map((permission) => ({ designation_id: payload.designationId, module: permission.module, feature: permission.feature, access_type: permission.accessType, compulsory: permission.compulsory ?? false })))
    await transaction.commit()
    return getStaffAssignment(payload.staffId)
  } catch (exception) {
    await transaction.rollback()
    throw exception
  }
}

export const getStaffAssignment = async (staffId: number) => {
  const staff = await User.query().where('id', staffId).preload('designation').first()
  if (!staff) throw validationError(`Staff with ID: ${staffId} does not exist`)
  const permissions = staff.designationId ? await StaffPermission.query().where('designation_id', staff.designationId).orderBy('module').orderBy('feature') : []
  return { staff: { id: staff.id, email: staff.email, designationId: staff.designationId }, designation: staff.designation ? { id: staff.designation.id, department: staff.designation.department, designation: staff.designation.designation } : null, permissions: permissions.map((permission) => permission.serialize()) }
}
