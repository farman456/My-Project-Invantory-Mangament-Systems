import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import DepartmentDesignation from '#models/department_designation'

export default class StaffPermission extends BaseModel {
  static table = 'designation_permissions'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'designation_id' })
  declare designationId: number

  @column()
  declare module: string

  @column()
  declare feature: string

  @column({ columnName: 'access_type' })
  declare accessType: string

  @column()
  declare compulsory: boolean

  @belongsTo(() => DepartmentDesignation, { foreignKey: 'designationId' })
  declare designation: BelongsTo<typeof DepartmentDesignation>
}
