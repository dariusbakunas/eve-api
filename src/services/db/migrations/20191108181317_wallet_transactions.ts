import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('walletTransactions', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.bigInteger('clientId')
      .unsigned()
      .notNullable();
    t.boolean('isBuy').notNullable();
    t.boolean('isPersonal').notNullable();
    t.bigInteger('quantity')
      .unsigned()
      .notNullable();
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.bigInteger('locationId')
      .unsigned()
      .notNullable();
    t.bigInteger('journalRefId')
      .unsigned()
      .notNullable();
    t.float('unitPrice', 15).notNullable();
    t.dateTime('date').notNullable();
    t.bigInteger('characterId')
      .unsigned()
      .notNullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('walletTransactions');
}
