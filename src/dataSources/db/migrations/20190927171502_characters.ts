import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('characters', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();

    t.string('name')
      .notNullable()
      .unique();

    t.string('accessToken').notNullable();

    t.string('refreshToken').notNullable();

    t.bigInteger('expiresAt').notNullable();

    t.integer('ownerId').unsigned();

    t.foreign('ownerId').references('users.id');

    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('characters');
}
