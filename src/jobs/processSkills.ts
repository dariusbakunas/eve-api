import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import logger from '../utils/logger';
import { PartialUpdate, transaction } from 'objection';
import { CharacterSkill } from '../services/db/models/characterSkill';

export const processSkills = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting skills for character: ${character.name}`);

  try {
    const skillsResponse = await esiApi.getCharacterSkills(character.id, token);

    const characterUpdate: Partial<Character> = {
      totalSp: skillsResponse.total_sp,
    };

    await db.Character.query()
      .findById(character.id)
      .patch(characterUpdate);

    const knex = CharacterSkill.knex();
    const { skills } = skillsResponse;

    let inserted = 0;
    let updated = 0;

    await transaction(knex, async trx => {
      const existingEntries = await db.CharacterSkill.query(trx)
        .select('skillId')
        .where('characterId', character.id)
        .pluck('skillId');

      const entrySet = new Set(existingEntries);
      for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];

        if (!entrySet.has(skill.skill_id)) {
          await db.CharacterSkill.query().insert({
            activeSkillLevel: skill.active_skill_level,
            skillId: skill.skill_id,
            skillPointsInSkill: skill.skillpoints_in_skill,
            trainedSkillLevel: skill.trained_skill_level,
            characterId: character.id,
          });
          inserted++;
        } else {
          const update: PartialUpdate<CharacterSkill> = {
            activeSkillLevel: skill.active_skill_level,
            skillPointsInSkill: skill.skillpoints_in_skill,
            trainedSkillLevel: skill.trained_skill_level,
          };

          await db.CharacterSkill.query()
            .patch(update)
            .where('characterId', character.id)
            .andWhere('skillId', skill.skill_id);

          updated++;
        }
      }
    });

    const message = `Finished processing character skills, new: ${inserted}, updated: ${updated}`;
    logger.info(`${message}, for ${character.name}`);

    await db.JobLogEntry.query().insert({
      category: 'SKILLS',
      status: 'SUCCESS',
      message: message,
      characterId: character.id,
    });
  } catch (e) {
    logger.error(`Failed to get skills for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'SKILLS',
      status: 'FAILURE',
      message: 'Failed to get skills',
      error: e.message,
      characterId: character.id,
    });
  }
};
