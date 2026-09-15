import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_movements'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('product_id').unsigned().nullable().references('id').inTable('products')
      table.integer('warehouse_id').unsigned().nullable().references('id').inTable('warehouses')
      table.integer('batch_id').unsigned().nullable().references('id').inTable('batches')
      table.decimal('quantity_delta', 14, 3).nullable()
      table.decimal('unit_cost', 14, 4).nullable()
      table.string('movement_reason', 50).nullable()
      table.string('source_type', 50).nullable()
      table.integer('source_id').unsigned().nullable()
      table.integer('source_line_id').unsigned().nullable()
      table.integer('reversal_of_id').unsigned().nullable().references('id').inTable('stock_movements')
      table.string('idempotency_key', 150).nullable().unique()
      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
      table.index(['product_id', 'warehouse_id', 'batch_id'])
      table.index(['source_type', 'source_id'])
      table.index(['reversal_of_id'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['product_id', 'warehouse_id', 'batch_id'])
      table.dropIndex(['source_type', 'source_id'])
      table.dropIndex(['reversal_of_id'])
      table.dropColumn('product_id')
      table.dropColumn('warehouse_id')
      table.dropColumn('batch_id')
      table.dropColumn('quantity_delta')
      table.dropColumn('unit_cost')
      table.dropColumn('movement_reason')
      table.dropColumn('source_type')
      table.dropColumn('source_id')
      table.dropColumn('source_line_id')
      table.dropColumn('reversal_of_id')
      table.dropColumn('idempotency_key')
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
    })
  }
}