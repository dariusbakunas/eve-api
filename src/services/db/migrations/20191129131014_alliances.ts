import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('alliances', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.bigInteger('creatorCorporationId')
      .unsigned()
      .notNullable();
    t.string('name').notNullable();
    t.bigInteger('creatorId')
      .unsigned()
      .notNullable();
    t.dateTime('dateFounded').notNullable();
    t.bigInteger('executorCorporationId')
      .unsigned()
      .notNullable();
    t.bigInteger('factionId').unsigned();
    t.string('ticker').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('alliances');
}
