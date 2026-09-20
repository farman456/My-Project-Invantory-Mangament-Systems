import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    const missingColumns = ['category_id', 'distributor_id', 'manufacturer_id']

    for (const columnName of missingColumns) {
      const hasColumn = await this.schema.hasColumn(this.tableName, columnName)

      if (!hasColumn) {
        this.schema.alterTable(this.tableName, (table) => {
          table.integer(columnName).nullable()
        })
      }
    }

    const fkDefs = [
      { column: 'category_id', constraintName: 'products_category_id_foreign', table: 'categories' },
      { column: 'distributor_id', constraintName: 'products_distributor_id_foreign', table: 'distributors' },
      { column: 'manufacturer_id', constraintName: 'products_manufacturer_id_foreign', table: 'manufacturers' },
    ]

    for (const fk of fkDefs) {
      const constraintExists = await this.schema.hasTable(fk.table)
      if (!constraintExists) continue

      this.schema.alterTable(this.tableName, (table) => {
        table
          .foreign(fk.column, fk.constraintName)
          .references('id')
          .inTable(fk.table)
          .onUpdate('CASCADE')
          .onDelete('RESTRICT')
      })
    }
  }

  async down() {
    const fkDefs = [
      { column: 'category_id', constraintName: 'products_category_id_foreign' },
      { column: 'distributor_id', constraintName: 'products_distributor_id_foreign' },
      { column: 'manufacturer_id', constraintName: 'products_manufacturer_id_foreign' },
    ]

    for (const fk of fkDefs) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropForeign(fk.column, fk.constraintName)
      })
    }

    for (const columnName of ['category_id', 'distributor_id', 'manufacturer_id']) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn(columnName)
      })
    }
  }
}
