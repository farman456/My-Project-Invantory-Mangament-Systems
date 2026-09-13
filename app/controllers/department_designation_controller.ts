import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createDepartmentDesignation,
  deleteDepartmentDesignation,
  getDepartmentDesignation,
  listDepartmentDesignations,
  updateDepartmentDesignation,
} from '#services/department_designation_service'
import {
  createDepartmentDesignationValidator,
  departmentDesignationIdValidator,
  updateDepartmentDesignationPatchValidator,
  updateDepartmentDesignationValidator,
} from '#validators/department_designation_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class DepartmentDesignationController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const records = await listDepartmentDesignations(pagination.page, pagination.perPage, options)
      return sendSuccess('Department and designations listed successfully', records)
    } catch (error) {
      console.log('Department/designation listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createDepartmentDesignationValidator.validate(ctx.request.body())
      const record = await createDepartmentDesignation(payload)
      return sendSuccess('Department and designation created successfully', record)
    } catch (error) {
      console.log('Department/designation creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { departmentDesignationId } = await departmentDesignationIdValidator.validate(ctx.params)
      const record = await getDepartmentDesignation(departmentDesignationId)
      return sendSuccess('Department and designation retrieved successfully', record)
    } catch (error) {
      console.log('Department/designation retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { departmentDesignationId } = await departmentDesignationIdValidator.validate(ctx.params)
      const payload = await updateDepartmentDesignationValidator.validate(ctx.request.body())
      const record = await updateDepartmentDesignation(payload, departmentDesignationId)
      return sendSuccess('Department and designation updated successfully', record)
    } catch (error) {
      console.log('Department/designation updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async partialUpdate(ctx: HttpContext) {
    try {
      const { departmentDesignationId } = await departmentDesignationIdValidator.validate(ctx.params)
      const payload = await updateDepartmentDesignationPatchValidator.validate(ctx.request.body())
      const record = await updateDepartmentDesignation(payload, departmentDesignationId)
      return sendSuccess('Department and designation updated successfully', record)
    } catch (error) {
      console.log('Department/designation partially updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { departmentDesignationId } = await departmentDesignationIdValidator.validate(ctx.params)
      await deleteDepartmentDesignation(departmentDesignationId)
      return sendSuccess('Department and designation deleted successfully')
    } catch (error) {
      console.log('Department/designation deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
