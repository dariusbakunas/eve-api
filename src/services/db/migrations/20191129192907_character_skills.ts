import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('characterSkills', t => {
    t.integer('activeSkillLevel')
      .unsigned()
      .notNullable();
    t.bigInteger('skillId')
      .unsigned()
      .notNullable();
    t.bigInteger('skillPointsInSkill')
      .unsigned()
      .notNullable();
    t.integer('trainedSkillLevel')
      .unsigned()
      .notNullable();
    t.bigInteger('characterId')
      .unsigned()
      .notNullable();
    t.primary(['skillId', 'characterId']);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('characterSkills');
}
