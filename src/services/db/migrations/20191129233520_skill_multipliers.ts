import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('skillMultipliers', t => {
    t.bigInteger('skillId')
      .unsigned()
      .primary();
    t.integer('multiplier')
      .unsigned()
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('skillMultipliers');
}
