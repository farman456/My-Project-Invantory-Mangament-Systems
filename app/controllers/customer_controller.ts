import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import {
  createCustomerValidator,
  customerIdValidator,
  updateCustomerPatchValidator,
  updateCustomerValidator,
} from '#validators/customer_validator'
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from '#services/customer_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

export default class CustomerController {
  async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      return sendSuccess(
        'Customers listed successfully',
        await listCustomers(pagination.page, pagination.perPage, options)
      )
    } catch (error) {
      console.log('Customers listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async create(ctx: HttpContext) {
    try {
      const payload = await createCustomerValidator.validate(ctx.request.body())
      return sendSuccess('Customer created successfully', await createCustomer(payload))
    } catch (error) {
      console.log('Customer creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async show(ctx: HttpContext) {
    try {
      const { customerId } = await customerIdValidator.validate(ctx.params)
      return sendSuccess('Customer retrieved successfully', await getCustomer(customerId))
    } catch (error) {
      console.log('Customer retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async update(ctx: HttpContext) {
    try {
      const { customerId } = await customerIdValidator.validate(ctx.params)
      const payload =
        ctx.request.method() === 'PATCH'
          ? await updateCustomerPatchValidator.validate(ctx.request.body())
          : await updateCustomerValidator.validate(ctx.request.body())
      return sendSuccess(
        'Customer updated successfully',
        await updateCustomer(payload, customerId)
      )
    } catch (error) {
      console.log('Customer updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async delete(ctx: HttpContext) {
    try {
      const { customerId } = await customerIdValidator.validate(ctx.params)
      await deleteCustomer(customerId)
      return sendSuccess('Customer deleted successfully')
    } catch (error) {
      console.log('Customer deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}