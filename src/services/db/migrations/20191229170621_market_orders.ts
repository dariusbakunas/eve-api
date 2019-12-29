import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('marketOrders', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.integer('duration')
      .unsigned()
      .notNullable();
    t.boolean('isBuy').notNullable();
    t.dateTime('issued').notNullable();
    t.bigInteger('locationId')
      .unsigned()
      .notNullable();
    t.bigInteger('minVolume')
      .unsigned()
      .notNullable();
    t.float('price', 15).notNullable();
    t.string('range').notNullable();
    t.bigInteger('systemId')
      .unsigned()
      .notNullable();
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.bigInteger('volumeRemain')
      .unsigned()
      .notNullable();
    t.bigInteger('volumeTotal')
      .unsigned()
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('marketOrders');
}
