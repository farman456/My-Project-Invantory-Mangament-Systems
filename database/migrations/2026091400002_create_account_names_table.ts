import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'account_names'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('account_sub_head_id').notNullable().references('id').inTable('account_sub_heads').onDelete('RESTRICT')
      table.string('name', 150).notNullable()
      table.string('status', 20).notNullable().defaultTo('active')
      table.unique(['account_sub_head_id', 'name'])
      table.index(['account_sub_head_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
