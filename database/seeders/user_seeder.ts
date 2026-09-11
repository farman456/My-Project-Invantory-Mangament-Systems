import { UserTypeEnum } from '#enums/user_type_enum'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.updateOrCreate(
      { email: 'admin@experts.com' }, // Condition to find the intended user
      {
        email: 'admin@experts.com',
        password: 'Abc@1234',
        name: 'Super Admin',
        roleId: UserTypeEnum.superAdmin,
        status: 'active',
      }
    )
  }
}
