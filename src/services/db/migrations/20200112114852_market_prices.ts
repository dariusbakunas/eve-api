import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('marketPrices', t => {
    t.float('buyPrice', 15).notNullable();
    t.float('sellPrice', 15).notNullable();
    t.bigInteger('systemId')
      .unsigned()
      .notNullable();
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.primary(['typeId', 'systemId']);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('marketPrices');
}
