import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory_levels'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('product_id').unsigned().nullable().references('id').inTable('products')
      table.integer('warehouse_id').unsigned().nullable().references('id').inTable('warehouses')
      table.integer('batch_id').unsigned().nullable().references('id').inTable('batches')
      table.decimal('available_quantity', 14, 3).nullable()
      table.decimal('reserved_quantity', 14, 3).nullable()
      table.decimal('damaged_quantity', 14, 3).nullable()
      table.timestamp('updated_at').nullable()
      table.index(['product_id', 'warehouse_id'])
      table.index(['product_id', 'warehouse_id', 'batch_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['product_id', 'warehouse_id'])
      table.dropIndex(['product_id', 'warehouse_id', 'batch_id'])
      table.dropColumn('product_id')
      table.dropColumn('warehouse_id')
      table.dropColumn('batch_id')
      table.dropColumn('available_quantity')
      table.dropColumn('reserved_quantity')
      table.dropColumn('damaged_quantity')
      table.dropColumn('updated_at')
    })
  }
}