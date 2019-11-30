import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.table('characters', t => {
    t.integer('totalSp');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.table('characters', function(t) {
    t.dropColumn('totalSp');
  });
}
