import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'department_designation'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('department', 150)
      table.string('designation', 150)
      table.string('status', 20)
      table.string('actions', 50)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}