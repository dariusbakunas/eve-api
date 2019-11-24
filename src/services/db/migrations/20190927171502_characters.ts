import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('characters', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();

    t.string('name')
      .notNullable()
      .unique();

    t.string('scopes', 4096).notNullable();

    t.string('accessToken', 2048).notNullable();

    t.string('refreshToken', 2048).notNullable();

    t.bigInteger('expiresAt').notNullable();

    t.integer('ownerId').unsigned();

    t.integer('ancestryId')
      .unsigned()
      .notNullable();

    t.integer('bloodlineId')
      .unsigned()
      .notNullable();

    t.integer('raceId')
      .unsigned()
      .notNullable();

    t.dateTime('birthday').notNullable();

    t.string('gender').notNullable();

    t.foreign('ownerId').references('users.id');

    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('characters');
}
