import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('warehouseItems', t => {
    t.integer('typeId', 11)
      .unsigned()
      .notNullable();
    t.float('unitPrice', 15).notNullable();
    t.bigInteger('quantity')
      .unsigned()
      .notNullable();
    t.integer('warehouseId').unsigned();
    t.foreign('warehouseId')
      .references('warehouses.id')
      .onDelete('CASCADE');
    t.unique(['typeId', 'warehouseId']);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('warehouseItems');
}
