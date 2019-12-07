import { Alliance } from '../services/db/models/alliance';
import { IDataSources } from '../services';
import { PartialUpdate } from 'objection';
import logger from '../utils/logger';
import moment from 'moment';

export const processAlliances = async (db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info('Updating corporations');

  try {
    const allianceIds = await db.Corporation.query()
      .select('allianceId')
      .distinct('allianceId')
      .whereNotNull('allianceId')
      .pluck('allianceId');

    const existing = await db.Alliance.query()
      .select('id')
      .whereIn('id', allianceIds)
      .pluck('id');

    const existingSet = new Set(existing);
    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < allianceIds.length; i++) {
      const id = allianceIds[i];
      const alliance = await esiApi.getAllianceInfo(id);

      if (existingSet.has(id)) {
        updated++;
        const update: PartialUpdate<Alliance> = {
          executorCorporationId: alliance.executor_corporation_id,
          factionId: alliance.faction_id,
        };

        await db.Alliance.query()
          .findById(id)
          .patch(update);
      } else {
        inserted++;
        await db.Alliance.query().insert({
          id: id,
          name: alliance.name,
          creatorCorporationId: alliance.creator_corporation_id,
          creatorId: alliance.creator_id,
          dateFounded: moment(alliance.date_founded).toDate(),
          executorCorporationId: alliance.executor_corporation_id,
          factionId: alliance.faction_id,
          ticker: alliance.ticker,
        });
      }
    }
    logger.info(`Updated ${updated} alliances, inserted ${inserted} new ones`);
  } catch (e) {
    logger.error(`Failure updating alliances: ${e.message}`);
  }
};
