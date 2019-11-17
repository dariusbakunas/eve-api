import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('citadelCache', t => {
    t.bigInteger('id')
      .unsigned()
      .primary();
    t.string('name').notNullable();
    t.bigInteger('systemId')
      .unsigned()
      .notNullable();
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.bigInteger('creatorId').unsigned();
    t.dateTime('createdAt').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('citadelCache');
}
