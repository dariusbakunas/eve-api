import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import { PartialUpdate, transaction } from 'objection';
import { SkillQueueItem } from '../services/db/models/skillQueueItem';
import logger from '../utils/logger';
import moment from 'moment';

export const processSkillQueue = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting skill queue for character: ${character.name}`);

  try {
    const skillQueueItems = await esiApi.getCharacterSkillQueue(character.id, token);

    const knex = SkillQueueItem.knex();

    let inserted = 0;
    let updated = 0;
    let removed = 0;

    await transaction(knex, async trx => {
      const existingEntries = await db.SkillQueueItem.query(trx)
        .select('skillId')
        .where('characterId', character.id)
        .pluck('skillId');

      const entrySet = new Set(existingEntries);

      for (let i = 0; i < skillQueueItems.length; i++) {
        const skill = skillQueueItems[i];

        if (!entrySet.has(skill.skill_id)) {
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

          inserted++;
        } else {
          const update: PartialUpdate<SkillQueueItem> = {
            finishedLevel: skill.finished_level,
            levelEndSp: skill.level_end_sp,
            levelStartSp: skill.level_start_sp,
            queuePosition: skill.queue_position,
            trainingStartSp: skill.training_start_sp,
          };

          if (skill.finish_date) {
            update.finishDate = moment(skill.finish_date).toDate();
          }

          if (skill.start_date) {
            update.startDate = moment(skill.start_date).toDate();
          }

          await db.SkillQueueItem.query(trx)
            .where('skillId', skill.skill_id)
            .where('characterId', character.id)
            .patch(update);

          updated++;
        }
      }

      // remove missing
      const skillIdSet = new Set(skillQueueItems.map(item => item.skill_id));
      const idsToRemove = existingEntries.filter((entry: number) => !skillIdSet.has(entry));

      if (idsToRemove.length) {
        await db.SkillQueueItem.query(trx)
          .delete()
          .where('skillId', 'in', idsToRemove)
          .where('characterId', character.id);
        removed = idsToRemove.length;
      }

      const message = `Finished processing skill queue, new: ${inserted}, updated: ${updated}, deleted: ${removed}`;
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
