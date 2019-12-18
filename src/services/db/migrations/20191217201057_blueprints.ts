import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('blueprints', t => {
    t.bigInteger('id')
      .unsigned()
      .notNullable();
    t.string('locationType').notNullable();
    t.bigInteger('locationId')
      .unsigned()
      .notNullable();
    t.integer('materialEfficiency')
      .unsigned()
      .notNullable();
    t.boolean('isCopy').notNullable();
    t.integer('maxRuns').notNullable();
    t.integer('timeEfficiency')
      .unsigned()
      .notNullable();
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.bigInteger('characterId')
      .unsigned()
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('blueprints');
}
