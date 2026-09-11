import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createExpiryDamage,
  deleteExpiryDamage,
  getExpiryDamage,
  listExpiryDamage,
  updateExpiryDamage,
} from '#services/expiry_damage_service'
import {
  createExpiryDamageValidator,
  expiryDamageIdValidator,
  updateExpiryDamageValidator,
} from '#validators/expiry_damage_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ExpiryDamageController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const records = await listExpiryDamage(pagination.page, pagination.perPage, options)
      return sendSuccess('Expiry and damage records listed successfully', records)
    } catch (error) {
      console.log('Expiry and damage listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createExpiryDamageValidator.validate(ctx.request.body())
      const expiryDamage = await createExpiryDamage(payload)
      return sendSuccess('Expiry and damage record created successfully', expiryDamage)
    } catch (error) {
      console.log('Expiry and damage creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { expiryDamageId } = await expiryDamageIdValidator.validate(ctx.params)
      const record = await getExpiryDamage(expiryDamageId)
      return sendSuccess('Expiry and damage record retrieved successfully', record)
    } catch (error) {
      console.log('Expiry and damage retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { expiryDamageId } = await expiryDamageIdValidator.validate(ctx.params)
      const payload =
        ctx.request.method() === 'PATCH'
          ? await updateExpiryDamageValidator.validate(ctx.request.body())
          : await createExpiryDamageValidator.validate(ctx.request.body())
      const record = await updateExpiryDamage(payload, expiryDamageId)
      return sendSuccess('Expiry and damage record updated successfully', record)
    } catch (error) {
      console.log('Expiry and damage updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { expiryDamageId } = await expiryDamageIdValidator.validate(ctx.params)
      await deleteExpiryDamage(expiryDamageId)
      return sendSuccess('Expiry and damage record deleted successfully')
    } catch (error) {
      console.log('Expiry and damage deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
