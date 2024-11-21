import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'sales';

  async up() {
    this.schema.dropTableIfExists(this.tableName);
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('client_id').notNullable().unsigned().references('id').inTable('clients').onDelete('CASCADE');
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('SET NULL');
      table.integer('quantity').unsigned().notNullable();
      table.float('total_price', 10, 2).notNullable().checkPositive();
      table.float('unit_price', 10, 2).notNullable().checkPositive();
      table.timestamp('sale_date').notNullable();

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
