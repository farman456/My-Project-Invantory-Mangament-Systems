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
  declare licenseNumber: string | null

  @column()
  declare licenseExpiryDate: string | null

  @column()
  declare taxNumber: string | null

  @column()
  declare taxType: string | null

  @column()
  declare taxStatus: string | null

  @column()
  declare gstStatus: string | null

  @column()
  declare isActive: boolean

  @column()
  declare alsoCustomer: boolean

  @column()
  declare alsoSupplier: boolean

  @column()
  declare status: string | null

  @column()
  declare actions: string | null
}
