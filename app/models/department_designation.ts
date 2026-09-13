import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DepartmentDesignation extends BaseModel {
  static table = 'department_designation'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare department: string | null

  @column()
  declare designation: string | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null
}
