import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('warehouses', t => {
    t.increments('id')
      .unsigned()
      .primary();
    t.string('name').notNullable();
    t.integer('ownerId')
      .unsigned()
      .notNullable();

    t.foreign('ownerId').references('users.id');
    t.unique(['name', 'ownerId']);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('warehouses');
}
