import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'addresses';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');

      table.string('road').notNullable();

      table.integer('number').notNullable().defaultTo(0);

      table.string('complement');

      table.string('neighborhood').notNullable();

      table.string('city').notNullable();

      table.string('state').notNullable();

      table.string('country').notNullable();

      table.string('zip_code').notNullable();

      table.timestamp('created_at').defaultTo(new Date());
      table.timestamp('updated_at').defaultTo(new Date());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
