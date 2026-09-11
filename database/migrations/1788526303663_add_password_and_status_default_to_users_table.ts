import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('password', 255).notNullable()
      table.string('status', 20).notNullable().defaultTo('active').alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('password')
      table.string('status', 20).notNullable().alter()
    })
  }
}
