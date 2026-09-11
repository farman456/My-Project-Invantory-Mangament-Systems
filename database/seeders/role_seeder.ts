import { UserRoleName, UserTypeEnum } from '#enums/user_type_enum'
import Role from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const roles = [
      { id: UserTypeEnum.user, roleName: UserRoleName.user },
      { id: UserTypeEnum.admin, roleName: UserRoleName.admin },
      { id: UserTypeEnum.superAdmin, roleName: UserRoleName.superAdmin },
    ]

    for (const roleData of roles) {
      const roleByName = await Role.query().where('role_name', roleData.roleName).first()
      if (roleByName && roleByName.id !== roleData.id) {
        throw new Error(
          `Role ${roleData.roleName} already exists with an unexpected ID: ${roleByName.id}`
        )
      }

      const roleById = await Role.find(roleData.id)
      if (roleById && roleById.roleName !== roleData.roleName) {
        throw new Error(`Role ID ${roleData.id} is already assigned to ${roleById.roleName}`)
      }

      if (!roleByName && !roleById) {
        await Role.create({
          id: roleData.id,
          roleName: roleData.roleName,
          status: 'active',
          action: null,
        })
      }
    }

    const adminUser = await User.query().where('email', 'admin@experts.com').first()
    if (!adminUser) {
      throw new Error('Expected admin user was not found')
    }

    if (adminUser.roleId !== UserTypeEnum.superAdmin) {
      adminUser.roleId = UserTypeEnum.superAdmin
      await adminUser.save()
    }
  }
}
