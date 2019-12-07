import { IDataSources } from '../services';
import { JoinClause } from 'knex';
import { raw } from 'objection';
import logger from '../utils/logger';

export const cleanup = async (db: IDataSources['db']) => {
  logger.info('Starting cleanup job');

  const groupSubquery = db.JobLogEntry.query()
    .select('characterId', 'category', raw('group_concat(id order by createdAt desc) as ids'))
    .groupBy('characterId', 'category')
    .as('grouped');

  // get at least 5 entries in each category, character group
  const idsToKeep = await db.JobLogEntry.query()
    .select('id')
    .innerJoin(groupSubquery, function(this: JoinClause) {
      this.on('jobLogs.characterId', 'grouped.characterId')
        .on('jobLogs.category', 'grouped.category')
        .andOn(raw('find_in_set(id, ids) between 1 and 5'));
    })
    .pluck('id');

  const result = await db.JobLogEntry.query()
    .delete()
    .whereNotIn('id', idsToKeep);

  logger.info(`Cleaned up ${result} job log rows`);
};
