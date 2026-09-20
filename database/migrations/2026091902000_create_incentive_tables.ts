import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('incentive_rules', (table) => {
      table.increments('id')
      table.string('rule_name', 150).notNullable().unique()
      table.string('status', 20).notNullable().defaultTo('active')
      table.string('calculation_type', 30).notNullable()
      table.string('based_on', 30).notNullable()
      table.decimal('commission_rate', 8, 3).nullable()
      table.text('description').nullable()
      table.text('calculation_notes').nullable()
      table.text('formula_details').nullable()
      table.timestamps(true, true)
    })

    this.schema.createTable('incentive_schemas', (table) => {
      table.increments('id')
      table.string('schema_name', 150).notNullable().unique()
      table.string('period_cycle', 20).notNullable()
      table.decimal('sales_target_benchmark', 14, 2).notNullable()
      table.integer('rule_id').notNullable().references('id').inTable('incentive_rules').onDelete('RESTRICT')
      table.string('applicable_to', 30).notNullable()
      table.string('target_department', 150).nullable()
      table.date('effective_from').notNullable()
      table.date('effective_to').nullable()
      table.string('status', 20).notNullable().defaultTo('active')
      table.text('description').nullable()
      table.text('incentive_terms').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable('incentive_schemas')
    this.schema.dropTable('incentive_rules')
  }
}
