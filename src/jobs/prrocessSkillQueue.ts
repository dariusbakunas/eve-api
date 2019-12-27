import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import { SkillQueueItem } from '../services/db/models/skillQueueItem';
import { transaction } from 'objection';
import logger from '../utils/logger';
import moment from 'moment';

export const processSkillQueue = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting skill queue for character: ${character.name}`);

  try {
    const skillQueueItems = await esiApi.getCharacterSkillQueue(character.id, token);
    const knex = SkillQueueItem.knex();

    // TODO: may need to determine when skill training ends and create alert
    await transaction(knex, async trx => {
      // delete current
      await db.SkillQueueItem.query(trx)
        .delete()
        .where('characterId', character.id);

      for (let i = 0; i < skillQueueItems.length; i++) {
        const skill = skillQueueItems[i];

        await db.SkillQueueItem.query(trx).insert({
          skillId: skill.skill_id,
          characterId: character.id,
          finishedLevel: skill.finished_level,
          finishDate: skill.finish_date ? moment(skill.finish_date).toDate() : null,
          levelEndSp: skill.level_end_sp,
          levelStartSp: skill.level_start_sp,
          queuePosition: skill.queue_position,
          startDate: skill.start_date ? moment(skill.start_date).toDate() : null,
          trainingStartSp: skill.training_start_sp,
        });
      }

      const message = `Finished processing skill queue`;
      logger.info(`${message}, for ${character.name}`);

      await db.JobLogEntry.query().insert({
        category: 'SKILL_QUEUE',
        status: 'SUCCESS',
        message: message,
        characterId: character.id,
      });
    });
  } catch (e) {
    logger.error(`Failed to get skill queue for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'SKILL_QUEUE',
      status: 'FAILURE',
      message: 'Failed to get skill queue',
      error: e.message,
      characterId: character.id,
    });
  }
};
