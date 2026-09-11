import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Person extends BaseModel {
  static table = 'persons'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare contactPerson: string | null

  @column()
  declare phone: string | null

  @column()
  declare email: string | null

  @column()
  declare areaCity: string | null

  @column()
  declare status: string | null

  @column()
  declare actions: string | null
}
