import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('nameCache', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.string('name').notNullable();
    t.string('category').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('nameCache');
}
