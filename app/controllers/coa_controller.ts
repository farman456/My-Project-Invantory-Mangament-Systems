import type { HttpContext } from '@adonisjs/core/http'
import { sendSuccess } from '#services/custom_response_service'
import ErrorService from '#services/error_service'
import {
  bulkAccountNamesValidator,
  coaQueryValidator,
  createAccountNameValidator,
  createSubHeadValidator,
  coaIdValidator,
  updateAccountNameValidator,
  updateSubHeadValidator,
} from '#validators/coa_validator'
import {
  createAccountName,
  createAccountNames,
  createSubHead,
  deleteAccountHead,
  deleteAccountName,
  deleteSubHead,
  getTree,
  listCoa,
  listHeads,
  listNames,
  listSubHeads,
  updateAccountName,
  updateSubHead,
} from '#services/coa_service'

const queryValues = (ctx: HttpContext) => {
  const query = ctx.request.qs()
  return {
    ...query,
    headId: query.headId === undefined ? undefined : Number(query.headId),
    subHeadId: query.subHeadId === undefined ? undefined : Number(query.subHeadId),
    page: query.page === undefined ? undefined : Number(query.page),
    perPage: query.perPage === undefined ? undefined : Number(query.perPage),
    sortBy: query.sortBy ?? query.sort,
    sortOrder: query.sortOrder ?? query.order,
    investigationRequired: query.investigationRequired === undefined
      ? undefined
      : query.investigationRequired === 'true' || query.investigationRequired === true,
  }
}

export default class CoaController {
  async heads(ctx: HttpContext) {
    try {
      return sendSuccess('Account heads listed successfully', await listHeads(await coaQueryValidator.validate(queryValues(ctx))))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async subHeads(ctx: HttpContext) {
    try {
      const { headId } = await coaIdValidator.validate({ headId: Number(ctx.params.headId), id: 1 })
      return sendSuccess('Account sub-heads listed successfully', await listSubHeads(headId!, await coaQueryValidator.validate(queryValues(ctx))))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async names(ctx: HttpContext) {
    try {
      const { subHeadId } = await coaIdValidator.validate({ subHeadId: Number(ctx.params.subHeadId), id: 1 })
      return sendSuccess('Account names listed successfully', await listNames(subHeadId!, await coaQueryValidator.validate(queryValues(ctx))))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async index(ctx: HttpContext) {
    try {
      return sendSuccess('COA listed successfully', await listCoa(await coaQueryValidator.validate(queryValues(ctx))))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async tree(ctx: HttpContext) {
    try {
      return sendSuccess('COA tree retrieved successfully', await getTree())
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async createSubHead(ctx: HttpContext) {
    try {
      return sendSuccess('Account sub-head created successfully', await createSubHead(await createSubHeadValidator.validate(ctx.request.body())))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async createName(ctx: HttpContext) {
    try {
      return sendSuccess('Account name created successfully', await createAccountName(await createAccountNameValidator.validate(ctx.request.body())))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async createBulkNames(ctx: HttpContext) {
    try {
      return sendSuccess('Account names created successfully', await createAccountNames(await bulkAccountNamesValidator.validate(ctx.request.body())))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async updateSubHead(ctx: HttpContext) {
    try {
      const { id } = await coaIdValidator.validate({ id: Number(ctx.params.id) })
      return sendSuccess('Account sub-head updated successfully', await updateSubHead(id, await updateSubHeadValidator.validate(ctx.request.body())))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async updateName(ctx: HttpContext) {
    try {
      const { id } = await coaIdValidator.validate({ id: Number(ctx.params.id) })
      return sendSuccess('Account name updated successfully', await updateAccountName(id, await updateAccountNameValidator.validate(ctx.request.body())))
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async deleteSubHead(ctx: HttpContext) {
    try {
      const { id } = await coaIdValidator.validate({ id: Number(ctx.params.id) })
      await deleteSubHead(id)
      return sendSuccess('Account sub-head deleted successfully')
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async deleteHead(ctx: HttpContext) {
    try {
      const { id } = await coaIdValidator.validate({ id: Number(ctx.params.id) })
      await deleteAccountHead(id)
      return sendSuccess('Account head deleted successfully')
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }

  async deleteName(ctx: HttpContext) {
    try {
      const { id } = await coaIdValidator.validate({ id: Number(ctx.params.id) })
      await deleteAccountName(id)
      return sendSuccess('Account name deleted successfully')
    } catch (error) {
      return ErrorService.handleError(ctx, error)
    }
  }
}
