import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('journalEntries', t => {
    t.bigInteger('id').unsigned();
    t.float('amount', 15);
    t.float('balance', 15);
    t.bigInteger('contextId');
    t.string('contextIdType');
    t.dateTime('date').notNullable();
    t.string('description').notNullable();
    t.integer('firstPartyId').unsigned();
    t.string('reason');
    t.string('refType').notNullable();
    t.integer('secondPartyId').unsigned();
    t.float('tax', 15);
    t.integer('taxReceiverId').unsigned();
    t.bigInteger('characterId').unsigned();
    t.primary(['id', 'characterId']);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('journalEntries');
}
