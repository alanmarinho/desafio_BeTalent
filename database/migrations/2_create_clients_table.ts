import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'clients';

  async up() {
    this.schema.dropTableIfExists(this.tableName);
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();

      table.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('CPF').notNullable();

      table.dateTime('created_at', { useTz: true }).defaultTo(this.now());
      table.dateTime('updated_at', { useTz: true }).defaultTo(this.now());

      table.unique(['CPF', 'user_id']); // um user não pode cadrastrar o mesmo cpf mais de um vez, mas um cpf pode ser cadrastrado por mais de um user
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
