import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('characterMarketOrders', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.integer('duration')
      .unsigned()
      .notNullable();
    t.float('escrow', 15);
    t.boolean('isBuy').notNullable();
    t.boolean('isCorporation').notNullable();
    t.dateTime('issued').notNullable();
    t.bigInteger('locationId')
      .unsigned()
      .notNullable();
    t.bigInteger('minVolume').unsigned();
    t.float('price', 15).notNullable();
    t.string('range').notNullable();
    t.bigInteger('regionId')
      .unsigned()
      .notNullable();
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.enu('state', ['active', 'cancelled', 'expired']).notNullable();
    t.bigInteger('volumeRemain')
      .unsigned()
      .notNullable();
    t.bigInteger('volumeTotal')
      .unsigned()
      .notNullable();
    t.bigInteger('characterId')
      .unsigned()
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('characterMarketOrders');
}
