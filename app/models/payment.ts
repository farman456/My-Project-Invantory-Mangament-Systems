import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Payment extends BaseModel {
  static table = 'payments'
  @column({ isPrimary: true }) declare id: number
  @column() declare paymentDirection: string
  @column() declare voucherNumber: string
  @column() declare paymentDate: string
  @column() declare transactionType: string
  @column() declare partyBeneficiary: string
  @column() declare paymentMode: string
  @column() declare bankAccount: string | null
  @column() declare value: number
  @column() declare referenceNumber: string | null
  @column() declare status: string
}
