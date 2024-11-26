import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'phones';

  async up() {
    this.schema.dropTableIfExists(this.tableName);
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('client_id').notNullable().unsigned().references('id').inTable('clients').onDelete('CASCADE');
      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('number').notNullable();

      table.dateTime('created_at', { useTz: true }).defaultTo(this.now());
      table.dateTime('updated_at', { useTz: true }).defaultTo(this.now());

      table.unique(['number', 'user_id']);
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
