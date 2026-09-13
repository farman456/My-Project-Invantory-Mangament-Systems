import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import {
  createDistributorValidator,
  distributorIdValidator,
  updateDistributorPatchValidator,
  updateDistributorValidator,
} from '#validators/distributor_validator'
import {
  createDistributor,
  deleteDistributor,
  getDistributor,
  listDistributors,
  updateDistributor,
} from '#services/distributor_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

export default class DistributorController {
  async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      return sendSuccess(
        'Distributors listed successfully',
        await listDistributors(pagination.page, pagination.perPage, options)
      )
    } catch (error) {
      console.log('Distributors listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async create(ctx: HttpContext) {
    try {
      const payload = await createDistributorValidator.validate(ctx.request.body())
      return sendSuccess('Distributor created successfully', await createDistributor(payload))
    } catch (error) {
      console.log('Distributor creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async show(ctx: HttpContext) {
    try {
      const { distributorId } = await distributorIdValidator.validate(ctx.params)
      return sendSuccess('Distributor retrieved successfully', await getDistributor(distributorId))
    } catch (error) {
      console.log('Distributor retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async update(ctx: HttpContext) {
    try {
      const { distributorId } = await distributorIdValidator.validate(ctx.params)
      const payload = ctx.request.method() === 'PATCH'
        ? await updateDistributorPatchValidator.validate(ctx.request.body())
        : await updateDistributorValidator.validate(ctx.request.body())
      return sendSuccess('Distributor updated successfully', await updateDistributor(payload, distributorId))
    } catch (error) {
      console.log('Distributor updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async delete(ctx: HttpContext) {
    try {
      const { distributorId } = await distributorIdValidator.validate(ctx.params)
      await deleteDistributor(distributorId)
      return sendSuccess('Distributor deleted successfully')
    } catch (error) {
      console.log('Distributor deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}