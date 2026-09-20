import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {

  protected tableName = 'users'

  async up() {

    this.schema.createTable(this.tableName, (table) => {

      table.increments('id')

      table.integer('person_id').references('id').inTable('persons')

    })

  }

  async down() {

    this.schema.dropTable(this.tableName)

  }

}