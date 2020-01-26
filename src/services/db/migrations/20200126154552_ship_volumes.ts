import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('shipVolumes', t => {
    t.integer('groupId', 11)
      .unsigned()
      .notNullable()
      .primary();
    t.float('volume', 15).notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('shipVolumes');
}
