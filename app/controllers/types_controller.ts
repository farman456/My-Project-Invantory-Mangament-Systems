import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import { createType, deleteType, getType, listTypes, updateType } from '#services/type_service'
import {
  createTypeValidator,
  typeIdValidator,
  updateTypeValidator,
} from '#validators/type_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class TypesController {
  public async options(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const types = await listTypes(pagination.page, pagination.perPage, options)
      return sendSuccess('Types listed successfully', types)
    } catch (error) {
      console.log('Types listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async store(ctx: HttpContext) {
    try {
      const payload = await createTypeValidator.validate(ctx.request.body())
      const type = await createType(payload)
      return sendSuccess('Type created successfully', type)
    } catch (error) {
      console.log('Type creation error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { typeId } = await typeIdValidator.validate(ctx.params)
      const type = await getType(typeId)
      return sendSuccess('Type retrieved successfully', type)
    } catch (error) {
      console.log('Type retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { typeId } = await typeIdValidator.validate(ctx.params)
      const payload = await updateTypeValidator.validate(ctx.request.body())
      const type = await updateType(payload, typeId)
      return sendSuccess('Type updated successfully', type)
    } catch (error) {
      console.log('Type updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async destroy(ctx: HttpContext) {
    try {
      const { typeId } = await typeIdValidator.validate(ctx.params)
      await deleteType(typeId)
      return sendSuccess('Type deleted successfully')
    } catch (error) {
      console.log('Type deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
