import { HttpContext } from '@adonisjs/core/http'

export default class ErrorService {
  private static getErrorCode(error: any) {
    return error?.code ?? error?.cause?.code
  }

  private static getErrorMessage(error: any) {
    return typeof error?.message === 'string' ? error.message : String(error)
  }

  private static isAuthenticationError(error: any) {
    const code = this.getErrorCode(error)
    const message = this.getErrorMessage(error).toLowerCase()

    return (
      error?.status === 401 ||
      ['E_AUTHENTICATION_ERROR', 'E_INVALID_CREDENTIALS', 'E_UNAUTHORIZED_ACCESS'].includes(code) ||
      message.includes('invalid user credentials') ||
      message.includes('unauthorized access')
    )
  }

  private static isNotFoundError(error: any) {
    return (
      error?.status === 404 || this.getErrorMessage(error).toLowerCase().includes('does not exist')
    )
  }

  private static isDuplicateError(error: any) {
    const code = this.getErrorCode(error)
    const message = this.getErrorMessage(error).toLowerCase()

    return (
      ['ER_DUP_ENTRY', '23505'].includes(code) ||
      error?.errno === 1062 ||
      message.includes('duplicate entry') ||
      message.includes('unique constraint')
    )
  }

  private static isForeignKeyError(error: any) {
    const code = this.getErrorCode(error)
    const message = this.getErrorMessage(error).toLowerCase()

    return (
      ['ER_NO_REFERENCED_ROW_2', 'ER_ROW_IS_REFERENCED_2', '23503'].includes(code) ||
      [1451, 1452].includes(error?.errno) ||
      message.includes('foreign key constraint')
    )
  }

  private static formatErrors(errors: any) {
    if (Array.isArray(errors)) {
      return errors
    }

    return [
      {
        message: errors.message || errors,
        rule: errors.rule || 'unknown',
        field: errors.field || 'unknown',
      },
    ]
  }

  public static handleValidationError(ctx: HttpContext, error: any) {
    const formattedErrors = this.formatErrors(error.messages)

    return ctx.response.status(422).json({
      status: false,
      message: 'Validation failure',
      errors: formattedErrors,
    })
  }

  public static handleDatabaseError(ctx: HttpContext, _error: any) {
    return ctx.response.status(500).json({
      status: false,
      message: 'Database error',
      errors: [
        {
          message: 'Database operation failed',
          rule: 'database',
          field: 'unknown',
        },
      ],
    })
  }

  public static handleNotFoundError(ctx: HttpContext, error: any) {
    return ctx.response.status(404).json({
      status: false,
      message: 'Something went wrong',
      errors: this.formatErrors(this.getErrorMessage(error)),
    })
  }

  public static handleConflictError(ctx: HttpContext, error: any) {
    return ctx.response.status(409).json({
      status: false,
      message: 'Conflict',
      errors: [
        {
          message: this.isDuplicateError(error)
            ? 'A record with the same unique value already exists'
            : 'The resource cannot be changed because it is referenced by another record',
          rule: 'conflict',
          field: 'unknown',
        },
      ],
    })
  }

  public static handleForeignKeyError(ctx: HttpContext) {
    return ctx.response.status(422).json({
      status: false,
      message: 'Validation failure',
      errors: [
        {
          message: 'A related record does not exist',
          rule: 'exists',
          field: 'unknown',
        },
      ],
    })
  }

  public static handleAuthenticationError(ctx: HttpContext, error: any) {
    const formattedErrors = this.formatErrors(error.message || error)

    return ctx.response.status(401).json({
      status: false,
      message: 'Authentication error',
      errors: formattedErrors,
    })
  }

  public static handleGenericError(ctx: HttpContext, _error: any) {
    return ctx.response.status(500).json({
      status: false,
      message: 'Something went wrong',
      errors: [
        {
          message: 'Internal server error',
          rule: 'server',
          field: 'unknown',
        },
      ],
    })
  }

  public static handleError(ctx: HttpContext, error: any) {
    if (this.isAuthenticationError(error)) {
      return this.handleAuthenticationError(ctx, error)
    }

    if (this.getErrorCode(error) === 'E_VALIDATION_ERROR') {
      return this.handleValidationError(ctx, error)
    }

    if (this.isNotFoundError(error)) {
      return this.handleNotFoundError(ctx, error)
    }

    if (
      this.isDuplicateError(error) ||
      (this.isForeignKeyError(error) && this.getErrorMessage(error).includes('referenced'))
    ) {
      return this.handleConflictError(ctx, error)
    }

    if (this.isForeignKeyError(error)) {
      return this.handleForeignKeyError(ctx)
    }

    if (this.getErrorCode(error) === 'E_DATABASE_ERROR' || error?.errno || error?.sqlState) {
      return this.handleDatabaseError(ctx, error)
    }

    return this.handleGenericError(ctx, error)
  }
}
