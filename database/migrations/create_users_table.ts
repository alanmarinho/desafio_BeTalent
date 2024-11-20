import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.string('email').notNullable().unique();
      table.string('password').notNullable();

      table.timestamp('created_at').defaultTo(new Date());
      table.timestamp('updated_at').defaultTo(new Date());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
