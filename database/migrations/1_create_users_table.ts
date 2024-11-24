import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  async up() {
    this.schema.dropTableIfExists(this.tableName);
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.string('email').notNullable().unique();
      table.string('name').notNullable();
      table.string('password').notNullable();

      table.dateTime('created_at').defaultTo(this.now());
      table.dateTime('updated_at').defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
