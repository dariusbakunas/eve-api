import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('jobLogs', t => {
    t.increments('id')
      .unsigned()
      .primary();
    t.timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.fn.now());
    t.enum('category', [
      'WALLET_TRANSACTIONS',
      'WALLET_JOURNAL',
      'BOOKMARKS',
      'MARKET_ORDERS',
      'ASSETS',
      'CALENDAR',
      'BLUEPRINTS',
      'CLONES',
      'IMPLANTS',
      'CONTACTS',
      'CONTRACTS',
      'INDUSTRY_JOBS',
      'STATS',
    ]).notNullable();
    t.enum('status', ['SUCCESS', 'FAILURE']).notNullable();
    t.string('message', 500).notNullable();
    t.text('error');
    t.bigInteger('characterId').unsigned();
    t.bigInteger('corporationId').unsigned();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('jobLogs');
}
