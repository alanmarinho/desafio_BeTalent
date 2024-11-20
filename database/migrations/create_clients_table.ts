import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'clients';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.string('name').notNullable();
      table.string('CPF').notNullable().unique();

      table.timestamp('created_at').defaultTo(new Date());
      table.timestamp('updated_at').defaultTo(new Date());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
