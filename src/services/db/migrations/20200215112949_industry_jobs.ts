import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('industryJobs', t => {
    t.integer('id', 11)
      .unsigned()
      .notNullable()
      .primary();
    t.integer('activityId')
      .unsigned()
      .notNullable();
    t.bigInteger('blueprintId').notNullable();
    t.bigInteger('blueprintLocationId').notNullable();
    t.integer('blueprintTypeId').notNullable();
    t.bigInteger('completedCharacterId');
    t.dateTime('completedDate');
    t.float('cost');
    t.integer('duration').notNullable();
    t.dateTime('endDate').notNullable();
    t.bigInteger('facilityId').notNullable();
    t.bigInteger('installerId').notNullable();
    t.integer('licensedRuns');
    t.bigInteger('outputLocationId').notNullable();
    t.dateTime('pauseDate');
    t.float('probability');
    t.integer('productTypeId');
    t.integer('runs').notNullable();
    t.dateTime('startDate').notNullable();
    t.bigInteger('stationId').notNullable();
    t.enum('status', ['active', 'cancelled', 'delivered', 'paused', 'ready', 'reverted']).notNullable();
    t.integer('successfulRuns');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('industryJobs');
}
