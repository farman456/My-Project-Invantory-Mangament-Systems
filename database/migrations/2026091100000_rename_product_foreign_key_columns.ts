import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('type', 'products_type_foreign')
      table.dropForeign('supplier', 'products_supplier_foreign')
      table.renameColumn('type', 'type_id')
      table.renameColumn('supplier', 'supplier_id')
      table
        .foreign('type_id', 'products_type_id_foreign')
        .references('id')
        .inTable('types')
      table
        .foreign('supplier_id', 'products_supplier_id_foreign')
        .references('id')
        .inTable('suppliers')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('type_id', 'products_type_id_foreign')
      table.dropForeign('supplier_id', 'products_supplier_id_foreign')
      table.renameColumn('type_id', 'type')
      table.renameColumn('supplier_id', 'supplier')
      table
        .foreign('type', 'products_type_foreign')
        .references('id')
        .inTable('types')
      table
        .foreign('supplier', 'products_supplier_foreign')
        .references('id')
        .inTable('suppliers')
    })
  }
}
