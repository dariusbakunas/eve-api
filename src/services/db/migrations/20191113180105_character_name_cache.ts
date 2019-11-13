import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('characterNameCache', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.string('name')
      .notNullable()
      .unique();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('characterNameCache');
}
