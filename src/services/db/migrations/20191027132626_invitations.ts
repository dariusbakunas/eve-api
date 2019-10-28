import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('invitations', t => {
    t.increments('id')
      .unsigned()
      .primary();
    t.string('email')
      .notNullable()
      .unique();
    t.string('code').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('invitations');
}
