import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'distributors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('person_id').unsigned().references('id').inTable('persons')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}