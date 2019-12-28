import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('characterSkillQueue', t => {
    t.bigInteger('skillId')
      .unsigned()
      .notNullable();
    t.bigInteger('characterId')
      .unsigned()
      .notNullable();
    t.dateTime('finishDate');
    t.integer('finishedLevel').notNullable();
    t.integer('levelEndSp');
    t.integer('levelStartSp');
    t.integer('queuePosition');
    t.dateTime('startDate');
    t.integer('trainingStartSp');
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('characterSkillQueue');
}
