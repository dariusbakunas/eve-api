import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("characters", t => {
    t.increments("id")
      .unsigned()
      .primary();

    t.string("accessToken")
      .notNullable()
      .unique();

    t.string("refreshToken")
      .notNullable()
      .unique();

    t.integer("ownerId").unsigned();

    t.foreign("ownerId").references("users.id");

    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("characters");
}
