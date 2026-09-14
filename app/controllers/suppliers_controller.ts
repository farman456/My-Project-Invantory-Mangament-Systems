import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createSupplier,
  deleteSupplier,
  getSupplier,
  listSuppliers,
  updateSupplier,
} from '#services/supplier_service'
import {
  createSupplierValidator,
  supplierIdValidator,
  updateSupplierPatchValidator,
  updateSupplierValidator,
} from '#validators/supplier_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class SuppliersController {
  public async create(ctx: HttpContext) {
    try {
      const payload = await createSupplierValidator.validate(ctx.request.body())
      const supplier = await createSupplier(payload)
      return sendSuccess('Supplier created successfully', supplier)
    } catch (error) {
      console.log('Supplier creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async options(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      const suppliers = await listSuppliers(pagination.page, pagination.perPage, options)
      return sendSuccess('Suppliers listed successfully', suppliers)
    } catch (error) {
      console.log('Suppliers listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { supplierId } = await supplierIdValidator.validate(ctx.params)
      const supplier = await getSupplier(supplierId)
      return sendSuccess('Supplier retrieved successfully', supplier)
    } catch (error) {
      console.log('Supplier retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { supplierId } = await supplierIdValidator.validate(ctx.params)
      const payload = ctx.request.method() === 'PATCH'
        ? await updateSupplierPatchValidator.validate(ctx.request.body())
        : await updateSupplierValidator.validate(ctx.request.body())
      const supplier = await updateSupplier(payload, supplierId)
      return sendSuccess('Supplier updated successfully', supplier)
    } catch (error) {
      console.log('Supplier updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async destroy(ctx: HttpContext) {
    try {
      const { supplierId } = await supplierIdValidator.validate(ctx.params)
      await deleteSupplier(supplierId)
      return sendSuccess('Supplier deleted successfully')
    } catch (error) {
      console.log('Supplier deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
