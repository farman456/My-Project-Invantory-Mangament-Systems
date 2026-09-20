import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.createTable('expenses', (table) => {
      table.increments('id')
      table.string('expense_id', 80).notNullable().unique()
      table.string('document_ref', 150).nullable()
      table.date('document_date').notNullable()
      table.jsonb('documents').nullable()
      table.jsonb('items').notNullable()
      table.jsonb('billing_summary').notNullable()
      table.jsonb('payment').notNullable()
      table.jsonb('payment_methods').nullable()
      table.string('status', 20).notNullable().defaultTo('active')
      table.timestamps(true, true)
    })

    this.schema.createTable('payments', (table) => {
      table.increments('id')
      table.string('payment_direction', 10).notNullable()
      table.string('voucher_number', 80).notNullable().unique()
      table.date('payment_date').notNullable()
      table.string('transaction_type', 80).notNullable()
      table.string('party_beneficiary', 150).notNullable()
      table.string('payment_mode', 50).notNullable()
      table.string('bank_account', 150).nullable()
      table.decimal('value', 14, 2).notNullable()
      table.string('reference_number', 150).nullable()
      table.string('status', 20).notNullable().defaultTo('active')
      table.timestamps(true, true)
    })

    this.schema.createTable('journals', (table) => {
      table.increments('id')
      table.string('journal_number', 80).notNullable().unique()
      table.date('journal_date').notNullable()
      table.string('journal_type', 80).notNullable()
      table.string('transaction_type', 80).notNullable()
      table.string('party_heads', 150).nullable()
      table.text('description').nullable()
      table.string('status', 20).notNullable().defaultTo('posted')
      table.timestamps(true, true)
    })

    this.schema.createTable('journal_lines', (table) => {
      table.increments('id')
      table.integer('journal_id').notNullable().references('id').inTable('journals').onDelete('CASCADE')
      table.integer('account_head_id').notNullable().references('id').inTable('account_heads').onDelete('RESTRICT')
      table.integer('account_sub_head_id').notNullable().references('id').inTable('account_sub_heads').onDelete('RESTRICT')
      table.text('narration').nullable()
      table.decimal('debit', 14, 2).notNullable().defaultTo(0)
      table.decimal('credit', 14, 2).notNullable().defaultTo(0)
    })
  }

  async down() {
    this.schema.dropTable('journal_lines')
    this.schema.dropTable('journals')
    this.schema.dropTable('payments')
    this.schema.dropTable('expenses')
  }
}
