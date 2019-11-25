import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('corporations', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.bigInteger('allianceId').unsigned();
    t.bigInteger('ceoId')
      .unsigned()
      .notNullable();
    t.bigInteger('creatorId')
      .unsigned()
      .notNullable();
    t.dateTime('dateFounded');
    t.text('description');
    t.bigInteger('factionId').unsigned();
    t.bigInteger('homeStationId').unsigned();
    t.bigInteger('memberCount')
      .unsigned()
      .notNullable();
    t.string('name').notNullable();
    t.bigInteger('shares').unsigned();
    t.float('taxRate', 15).notNullable();
    t.string('ticker').notNullable();
    t.string('url');
    t.boolean('warEligible');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('corporations');
}
