import { BaseModel, column } from '@adonisjs/lucid/orm'

const jsonColumn = () => ({
  prepare: (value: unknown) => JSON.stringify(value ?? {}),
  consume: (value: unknown) => typeof value === 'string' ? JSON.parse(value) : value,
})

export default class Setting extends BaseModel {
  static table = 'settings'

  @column({ isPrimary: true }) declare id: number
  @column(jsonColumn()) declare businessInformation: Record<string, unknown>
  @column(jsonColumn()) declare idConfigs: Record<string, unknown>
  @column(jsonColumn()) declare signStamps: Record<string, unknown>
  @column(jsonColumn()) declare warrantyTerms: Record<string, unknown>
  @column(jsonColumn()) declare invoiceTemplates: Record<string, unknown>
  @column(jsonColumn()) declare paperPrinters: Record<string, unknown>
}
