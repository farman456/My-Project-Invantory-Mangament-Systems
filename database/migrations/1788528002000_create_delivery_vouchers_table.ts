import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_vouchers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sale_order_id').references('id').inTable('sale_orders')
      table.integer('customer_id').references('id').inTable('customers')
      table.text('voucher_details')
      table.string('name', 150)
      table.integer('no_of_cartons')
      table.string('transporters', 150)
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}