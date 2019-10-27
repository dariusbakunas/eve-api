import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users', t => {
    t.increments('id')
      .unsigned()
      .primary();
    t.string('username')
      .notNullable()
      .unique();
    t.string('firstName').notNullable();
    t.string('lastName').notNullable();
    t.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('INACTIVE');
    t.string('email')
      .notNullable()
      .unique();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('users');
}
