import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Expense extends BaseModel {
  static table = 'expenses'
  @column({ isPrimary: true }) declare id: number
  @column() declare expenseId: string
  @column() declare documentRef: string | null
  @column() declare documentDate: string
  @column({ prepare: (value) => value === null ? null : JSON.stringify(value), consume: (value) => typeof value === 'string' ? JSON.parse(value) : value }) declare documents: Record<string, unknown> | null
  @column({ prepare: (value) => JSON.stringify(value), consume: (value) => typeof value === 'string' ? JSON.parse(value) : value }) declare items: Record<string, unknown>[]
  @column({ prepare: (value) => JSON.stringify(value), consume: (value) => typeof value === 'string' ? JSON.parse(value) : value }) declare billingSummary: Record<string, unknown>
  @column({ prepare: (value) => JSON.stringify(value), consume: (value) => typeof value === 'string' ? JSON.parse(value) : value }) declare payment: Record<string, unknown>
  @column({ prepare: (value) => value === null ? null : JSON.stringify(value), consume: (value) => typeof value === 'string' ? JSON.parse(value) : value }) declare paymentMethods: Record<string, unknown> | null
  @column() declare status: string
}
