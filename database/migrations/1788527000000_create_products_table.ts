import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('type_id').references('id').inTable('types')
      table.integer('category_id').references('id').inTable('categories')
      table.integer('distributor_id').references('id').inTable('distributors')
      table.integer('manufacturer_id').references('id').inTable('manufacturers')
      table.string('name', 150)
      table.decimal('price', 12, 2)
      table.integer('supplier_id').references('id').inTable('suppliers')
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}