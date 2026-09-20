import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { getStaffAssignment, saveStaffAssignment } from '#services/staff_assignment_service'
import { createStaffAssignmentValidator, staffAssignmentIdValidator, updateStaffAssignmentValidator } from '#validators/staff_assignment_validator'

export default class StaffAssignmentController {
  async show(ctx: HttpContext) {
    try { const { staffId } = await staffAssignmentIdValidator.validate(ctx.params); return sendSuccess('Staff assignment retrieved successfully', await getStaffAssignment(staffId)) } catch (exception) { return ErrorService.handleError(ctx, exception) }
  }
  async create(ctx: HttpContext) {
    try { const payload = await createStaffAssignmentValidator.validate(ctx.request.body()); return sendSuccess('Staff assignment saved successfully', await saveStaffAssignment(payload)) } catch (exception) { return ErrorService.handleError(ctx, exception) }
  }
  async update(ctx: HttpContext) {
    try { const { staffId } = await staffAssignmentIdValidator.validate(ctx.params); const payload = await updateStaffAssignmentValidator.validate(ctx.request.body()); return sendSuccess('Staff assignment updated successfully', await saveStaffAssignment({ ...payload, staffId })) } catch (exception) { return ErrorService.handleError(ctx, exception) }
  }
}
