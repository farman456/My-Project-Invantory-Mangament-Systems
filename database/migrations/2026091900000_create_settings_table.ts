import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.jsonb('business_information').notNullable().defaultTo('{}')
      table.jsonb('id_configs').notNullable().defaultTo('{}')
      table.jsonb('sign_stamps').notNullable().defaultTo('{}')
      table.jsonb('warranty_terms').notNullable().defaultTo('{}')
      table.jsonb('invoice_templates').notNullable().defaultTo('{}')
      table.jsonb('paper_printers').notNullable().defaultTo('{}')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
