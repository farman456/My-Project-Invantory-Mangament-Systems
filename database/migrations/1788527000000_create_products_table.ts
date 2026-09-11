import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('type').unsigned().references('id').inTable('types')
      table.string('name', 150)
      table.decimal('price', 12, 2)
      table.integer('supplier').unsigned().references('id').inTable('suppliers')
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}