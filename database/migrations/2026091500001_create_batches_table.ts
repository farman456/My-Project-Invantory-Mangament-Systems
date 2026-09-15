import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'batches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('product_id').unsigned().notNullable().references('id').inTable('products')
      table.string('batch_number', 100).notNullable()
      table.integer('warehouse_id').unsigned().nullable().references('id').inTable('warehouses')
      table.date('expiry_date').nullable()
      table.decimal('unit_cost', 14, 4).nullable()
      table.decimal('quantity_received', 14, 3).notNullable().defaultTo(0)
      table.decimal('quantity_available', 14, 3).notNullable().defaultTo(0)
      table.string('status', 20).notNullable().defaultTo('active')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.unique(['product_id', 'batch_number', 'warehouse_id'])
      table.index(['product_id', 'expiry_date'])
      table.index(['warehouse_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
