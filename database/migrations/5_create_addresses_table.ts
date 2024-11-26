import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'addresses';

  async up() {
    this.schema.dropTableIfExists(this.tableName);
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('client_id').notNullable().unsigned().references('id').inTable('clients').onDelete('CASCADE');
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');

      table.string('road').notNullable();

      table.integer('number').notNullable().defaultTo(0);

      table.string('complement');

      table.string('neighborhood').notNullable();

      table.string('city').notNullable();

      table.string('state').notNullable();

      table.string('country').notNullable();

      table.string('zip_code').notNullable();

      table.dateTime('created_at', { useTz: true }).defaultTo(this.now());
      table.dateTime('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
