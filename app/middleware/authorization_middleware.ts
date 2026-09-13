import User from '#models/user'
import { UserTypeEnum } from '#enums/user_type_enum'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthorizationMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authenticatedUser = ctx.auth.getUserOrFail()
    const user = await User.query().where('id', authenticatedUser.id).preload('role').first()

    if (!user?.role) {
      return this.forbidden(ctx)
    }

    const roleName = user.role.roleName?.toLowerCase()

    if (this.isRoleEscalationAttempt(ctx, roleName, user.roleId)) {
      return this.forbidden(ctx)
    }

    if (roleName === 'admin' || roleName === 'super admin') {
      return next()
    }

    if (roleName === 'user' && this.canUserAccessProfile(ctx, user.id)) {
      return next()
    }

    return this.forbidden(ctx)
  }

  private canUserAccessProfile(ctx: HttpContext, userId: number) {
    const path = new URL(ctx.request.url(), 'http://localhost').pathname
    const match = path.match(/^\/api\/users\/(\d+)$/)
    const method = ctx.request.method()

    return match !== null && (method === 'GET' || method === 'PATCH') && Number(match[1]) === userId
  }

  private isRoleEscalationAttempt(ctx: HttpContext, roleName: string | undefined, roleId: number) {
    const body = ctx.request.body()
    if (
      !body ||
      typeof body !== 'object' ||
      !Object.prototype.hasOwnProperty.call(body, 'role_id')
    ) {
      return false
    }

    if (roleName === 'user' || roleId === UserTypeEnum.user) {
      return true
    }

    return (
      (roleName === 'admin' || roleId === UserTypeEnum.admin) &&
      Number(body.role_id) === UserTypeEnum.superAdmin
    )
  }

  private forbidden(ctx: HttpContext) {
    return ctx.response.status(403).json({
      status: false,
      message: 'Authorization error',
      errors: [
        {
          message: 'You are not authorized to access this resource',
          rule: 'authorization',
          field: 'role',
        },
      ],
    })
  }
}
