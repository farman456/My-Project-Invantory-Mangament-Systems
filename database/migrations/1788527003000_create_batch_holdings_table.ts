import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'batch_holdings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('batch_details')
      table.integer('supplier').references('id').inTable('suppliers')
      table.integer('type').references('id').inTable('types')
      table.string('status', 20)
      table.string('action', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}