import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recycle_bin'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('source', 80).notNullable()
      table.integer('record_id').notNullable()
      table.timestamp('deleted_at').notNullable()
      table.integer('deleted_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.jsonb('record').notNullable().defaultTo('{}')
      table.unique(['source', 'record_id'])
      table.index(['deleted_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
