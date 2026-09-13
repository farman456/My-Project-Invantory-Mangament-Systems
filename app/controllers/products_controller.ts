import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from '#services/product_service'
import {
  createProductValidator,
  productIdValidator,
  updateProductPatchValidator,
  updateProductValidator,
} from '#validators/product_validator'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  public async index(ctx: HttpContext) {
    try {
      const { page, perPage, limit, pageSize, sortBy, sortOrder } = ctx.request.qs()
      const requestedPerPage = perPage ?? pageSize ?? limit
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: requestedPerPage === undefined ? undefined : Number(requestedPerPage),
      })
      const options = await validateListQuery({
        ...ctx.request.qs(),
        sort: sortBy,
        order: sortOrder,
      })
      const products = await listProducts(pagination.page, pagination.perPage, options)
      return sendSuccess('Products listed successfully', products)
    } catch (error) {
      console.log('Products listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async create(ctx: HttpContext) {
    try {
      const payload = await createProductValidator.validate(ctx.request.body())
      const product = await createProduct(payload)
      return sendSuccess('Product created successfully', product)
    } catch (error) {
      console.log('Product creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async show(ctx: HttpContext) {
    try {
      const { productId } = await productIdValidator.validate(ctx.params)
      const product = await getProduct(productId)
      return sendSuccess('Product retrieved successfully', product)
    } catch (error) {
      console.log('Product retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async update(ctx: HttpContext) {
    try {
      const { productId } = await productIdValidator.validate(ctx.params)
      const payload = await updateProductValidator.validate(ctx.request.body())
      const product = await updateProduct(payload, productId)
      return sendSuccess('Product updated successfully', product)
    } catch (error) {
      console.log('Product updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async partialUpdate(ctx: HttpContext) {
    try {
      const { productId } = await productIdValidator.validate(ctx.params)
      const payload = await updateProductPatchValidator.validate(ctx.request.body())
      const product = await updateProduct(payload, productId)
      return sendSuccess('Product updated successfully', product)
    } catch (error) {
      console.log('Product partially updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  public async delete(ctx: HttpContext) {
    try {
      const { productId } = await productIdValidator.validate(ctx.params)
      await deleteProduct(productId)
      return sendSuccess('Product deleted successfully')
    } catch (error) {
      console.log('Product deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}
