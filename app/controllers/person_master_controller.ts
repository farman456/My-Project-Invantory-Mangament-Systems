import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createPersonMaster,
  deletePersonMaster,
  getPersonMaster,
  listPersonMasters,
  updatePersonMaster,
} from '#services/person_master_service'
import {
  createPersonMasterValidator,
  personMasterIdValidator,
  updatePersonMasterPatchValidator,
  updatePersonMasterValidator,
} from '#validators/person_master_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class PersonMasterController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const persons = await listPersonMasters(pagination.page, pagination.perPage, options)
      return sendSuccess('Persons listed successfully', persons)
    } catch (error) {
      console.log('Persons listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createPersonMasterValidator.validate(ctx.request.body())
      const person = await createPersonMaster(payload)
      return sendSuccess('Person created successfully', person)
    } catch (error) {
      console.log('Person creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { personMasterId } = await personMasterIdValidator.validate(ctx.params)
      const person = await getPersonMaster(personMasterId)
      return sendSuccess('Person retrieved successfully', person)
    } catch (error) {
      console.log('Person retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { personMasterId } = await personMasterIdValidator.validate(ctx.params)
      const payload = await updatePersonMasterValidator.validate(ctx.request.body())
      const person = await updatePersonMaster(payload, personMasterId)
      return sendSuccess('Person updated successfully', person)
    } catch (error) {
      console.log('Person updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async partialUpdate(ctx: HttpContext) {
    try {
      const { personMasterId } = await personMasterIdValidator.validate(ctx.params)
      const payload = await updatePersonMasterPatchValidator.validate(ctx.request.body())
      const person = await updatePersonMaster(payload, personMasterId)
      return sendSuccess('Person updated successfully', person)
    } catch (error) {
      console.log('Person partially updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { personMasterId } = await personMasterIdValidator.validate(ctx.params)
      await deletePersonMaster(personMasterId)
      return sendSuccess('Person deleted successfully')
    } catch (error) {
      console.log('Person deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
