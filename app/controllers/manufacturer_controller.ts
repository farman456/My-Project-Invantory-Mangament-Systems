import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import {
  createManufacturerValidator,
  manufacturerIdValidator,
  updateManufacturerPatchValidator,
  updateManufacturerValidator,
} from '#validators/manufacturer_validator'
import {
  createManufacturer,
  deleteManufacturer,
  getManufacturer,
  listManufacturers,
  updateManufacturer,
} from '#services/manufacturer_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

export default class ManufacturerController {
  async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      return sendSuccess(
        'Manufacturers listed successfully',
        await listManufacturers(pagination.page, pagination.perPage, options)
      )
    } catch (error) {
      console.log('Manufacturers listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async create(ctx: HttpContext) {
    try {
      const payload = await createManufacturerValidator.validate(ctx.request.body())
      return sendSuccess('Manufacturer created successfully', await createManufacturer(payload))
    } catch (error) {
      console.log('Manufacturer creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async show(ctx: HttpContext) {
    try {
      const { manufacturerId } = await manufacturerIdValidator.validate(ctx.params)
      return sendSuccess('Manufacturer retrieved successfully', await getManufacturer(manufacturerId))
    } catch (error) {
      console.log('Manufacturer retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async update(ctx: HttpContext) {
    try {
      const { manufacturerId } = await manufacturerIdValidator.validate(ctx.params)
      const payload = ctx.request.method() === 'PATCH'
        ? await updateManufacturerPatchValidator.validate(ctx.request.body())
        : await updateManufacturerValidator.validate(ctx.request.body())
      return sendSuccess('Manufacturer updated successfully', await updateManufacturer(payload, manufacturerId))
    } catch (error) {
      console.log('Manufacturer updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async delete(ctx: HttpContext) {
    try {
      const { manufacturerId } = await manufacturerIdValidator.validate(ctx.params)
      await deleteManufacturer(manufacturerId)
      return sendSuccess('Manufacturer deleted successfully')
    } catch (error) {
      console.log('Manufacturer deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}