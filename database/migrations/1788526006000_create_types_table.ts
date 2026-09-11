import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'types'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 150)
      table.text('description')
      table.boolean('investigation_required')
      table.string('status', 20)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}