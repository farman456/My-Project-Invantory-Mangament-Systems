import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .foreign('tokenable_id', 'auth_access_tokens_tokenable_id_foreign')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('tokenable_id', 'auth_access_tokens_tokenable_id_foreign')
    })
  }
}
