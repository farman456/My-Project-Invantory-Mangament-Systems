import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'persons'

  async up() {
    this.schema.alterTable('persons', (table) => {
      table.string('license_number', 100).nullable()
      table.string('license_expiry_date', 20).nullable()
      table.string('tax_number', 100).nullable()
      table.string('tax_type', 20).nullable()
      table.string('tax_status', 20).nullable()
      table.string('gst_status', 20).nullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('also_customer').notNullable().defaultTo(false)
      table.boolean('also_supplier').notNullable().defaultTo(false)
    })

    this.schema.alterTable('categories', (table) => {
      table.text('description').nullable()
    })
  }

  async down() {
    this.schema.alterTable('categories', (table) => {
      table.dropColumn('description')
    })

    this.schema.alterTable('persons', (table) => {
      table.dropColumn('license_number')
      table.dropColumn('license_expiry_date')
      table.dropColumn('tax_number')
      table.dropColumn('tax_type')
      table.dropColumn('tax_status')
      table.dropColumn('gst_status')
      table.dropColumn('is_active')
      table.dropColumn('also_customer')
      table.dropColumn('also_supplier')
    })
  }
}
