import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('email', 150).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('status', 20).notNullable().defaultTo('active')
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    const hasEmail = await this.schema.hasColumn(this.tableName, 'email')
    const hasDeletedAt = await this.schema.hasColumn(this.tableName, 'deleted_at')

    this.schema.alterTable(this.tableName, (table) => {
      if (hasEmail) table.dropColumn('email')
      table.dropColumn('password')
      table.string('status', 20).notNullable().alter()
      if (hasDeletedAt) table.dropColumn('deleted_at')
    })
  }
}
