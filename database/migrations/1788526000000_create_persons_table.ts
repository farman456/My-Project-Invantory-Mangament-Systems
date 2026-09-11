import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'persons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 150)
      table.string('contact_person', 150)
      table.string('phone', 30)
      table.string('email', 150)
      table.string('area_city', 150)
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}