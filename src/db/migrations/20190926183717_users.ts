import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("users", (t) => {
    t.increments("id").unsigned().primary();
    t.string("email").notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('users');
}
