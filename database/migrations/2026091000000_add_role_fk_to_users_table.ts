import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    const hasRoleId = await this.schema.hasColumn(this.tableName, 'role_id')

    if (!hasRoleId) {
      this.schema.alterTable(this.tableName, (table) => {
        table.integer('role_id').notNullable().defaultTo(1)
      })
    }

    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('role_id', 'users_role_id_foreign')
        .references('id')
        .inTable('roles')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('role_id', 'users_role_id_foreign')
    })
  }
}
