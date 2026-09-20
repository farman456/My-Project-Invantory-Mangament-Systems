import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('purchase_order_id').references('id').inTable('purchase_orders')
      table.integer('supplier_id').references('id').inTable('suppliers')
      table.text('invoice_details')
      table.string('name', 150)
      table.integer('no_of_items')
      table.decimal('invoice_value', 12, 2)
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}