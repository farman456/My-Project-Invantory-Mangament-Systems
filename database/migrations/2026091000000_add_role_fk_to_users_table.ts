import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    const hasRoleId = await this.schema.hasColumn(this.tableName, 'role_id')

    if (!hasRoleId) {
      this.schema.alterTable(this.tableName, (table) => {
        table.integer('role_id').unsigned().notNullable().defaultTo(1)
      })
    }

    const constraints = await db.rawQuery(
      `SELECT CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = ?
         AND COLUMN_NAME = 'role_id'
         AND REFERENCED_TABLE_NAME = 'roles'
         AND REFERENCED_COLUMN_NAME = 'id'`,
      [this.tableName]
    )

    if (constraints[0].length === 0) {
      this.schema.alterTable(this.tableName, (table) => {
        table
          .foreign('role_id', 'users_role_id_foreign')
          .references('id')
          .inTable('roles')
          .onUpdate('CASCADE')
          .onDelete('RESTRICT')
      })
    }
  }

  async down() {
    const constraints = await db.rawQuery(
      `SELECT CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = ?
         AND COLUMN_NAME = 'role_id'
         AND REFERENCED_TABLE_NAME = 'roles'
         AND REFERENCED_COLUMN_NAME = 'id'`,
      [this.tableName]
    )

    if (constraints[0].length > 0) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropForeign('role_id', 'users_role_id_foreign')
      })
    }
  }
}
