import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("scopes", t => {
    t.increments("id")
      .unsigned()
      .primary();
    t.string("name").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("scopes");
}
