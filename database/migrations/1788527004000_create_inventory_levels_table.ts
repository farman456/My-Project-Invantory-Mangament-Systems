import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory_levels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 150)
      table.integer('supplier').references('id').inTable('suppliers')
      table.string('warehouse', 150)
      table.integer('hold')
      table.integer('total')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}