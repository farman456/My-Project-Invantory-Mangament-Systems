import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sale_invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sale_order_id').references('id').inTable('sale_orders')
      table.integer('customer_id').references('id').inTable('customers')
      table.text('invoice_details')
      table.string('name', 150)
      table.integer('no_of_items')
      table.string('referral', 150)
      table.decimal('invoice_value', 12, 2)
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}