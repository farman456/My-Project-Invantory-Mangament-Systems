import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_returns'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('purchase_invoice_id').references('id').inTable('purchase_invoices')
      table.integer('supplier_id').references('id').inTable('suppliers')
      table.text('return_details')
      table.string('name', 150)
      table.string('status', 20)
      table.integer('no_of_cartons')
      table.decimal('refund_value', 12, 2)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}