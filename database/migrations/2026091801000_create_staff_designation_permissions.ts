import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.integer('designation_id').unsigned().nullable().references('id').inTable('department_designation').onDelete('SET NULL')
    })
    this.schema.createTable('designation_permissions', (table) => {
      table.increments('id')
      table.integer('designation_id').unsigned().notNullable().references('id').inTable('department_designation').onDelete('CASCADE')
      table.string('module', 50).notNullable()
      table.string('feature', 80).notNullable()
      table.string('access_type', 20).notNullable()
      table.boolean('compulsory').notNullable().defaultTo(false)
      table.unique(['designation_id', 'module', 'feature'])
    })
  }
  async down() {
    this.schema.dropTable('designation_permissions')
    this.schema.alterTable('users', (table) => { table.dropColumn('designation_id') })
  }
}
