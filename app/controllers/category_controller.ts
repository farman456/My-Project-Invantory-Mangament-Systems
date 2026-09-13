import type { HttpContext } from '@adonisjs/core/http'
import { listPaginationValidator } from '#validators/list_pagination_validator'
import { validateListQuery } from '#validators/list_query_validator'
import {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryPatchValidator,
  updateCategoryValidator,
} from '#validators/category_validator'
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from '#services/category_service'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'

export default class CategoryController {
  async index(ctx: HttpContext) {
    try {
      const { page, perPage } = ctx.request.qs()
      const pagination = await listPaginationValidator.validate({
        page: page === undefined ? undefined : Number(page),
        perPage: perPage === undefined ? undefined : Number(perPage),
      })
      const options = await validateListQuery(ctx.request.qs())
      return sendSuccess(
        'Categories listed successfully',
        await listCategories(pagination.page, pagination.perPage, options)
      )
    } catch (error) {
      console.log('Categories listing error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async create(ctx: HttpContext) {
    try {
      const payload = await createCategoryValidator.validate(ctx.request.body())
      return sendSuccess('Category created successfully', await createCategory(payload))
    } catch (error) {
      console.log('Category creating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async show(ctx: HttpContext) {
    try {
      const { categoryId } = await categoryIdValidator.validate(ctx.params)
      return sendSuccess('Category retrieved successfully', await getCategory(categoryId))
    } catch (error) {
      console.log('Category retrieval error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async update(ctx: HttpContext) {
    try {
      const { categoryId } = await categoryIdValidator.validate(ctx.params)
      const payload = ctx.request.method() === 'PATCH'
        ? await updateCategoryPatchValidator.validate(ctx.request.body())
        : await updateCategoryValidator.validate(ctx.request.body())
      return sendSuccess('Category updated successfully', await updateCategory(payload, categoryId))
    } catch (error) {
      console.log('Category updating error', error)
      return ErrorService.handleError(ctx, error)
    }
  }

  async delete(ctx: HttpContext) {
    try {
      const { categoryId } = await categoryIdValidator.validate(ctx.params)
      await deleteCategory(categoryId)
      return sendSuccess('Category deleted successfully')
    } catch (error) {
      console.log('Category deleting error', error)
      return ErrorService.handleError(ctx, error)
    }
  }
}