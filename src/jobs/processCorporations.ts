import { Corporation } from '../services/db/models/corporation';
import { IDataSources } from '../services';
import { PartialUpdate } from 'objection';
import logger from '../utils/logger';
import moment from 'moment';

export const processCorporations = async (db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info('Updating corporations');

  try {
    const corpIds = await db.Character.query()
      .select('corporationId')
      .distinct('corporationId')
      .pluck('corporationId');

    const existing = await db.Corporation.query()
      .select('id')
      .whereIn('id', corpIds)
      .pluck('id');

    const existingSet = new Set(existing);
    let inserted = 0;
    let updated = 0;

    for (let i = 0; i < corpIds.length; i++) {
      const id = corpIds[i];
      const corp = await esiApi.getCorporationInfo(id);

      if (existingSet.has(id)) {
        updated++;
        const update: PartialUpdate<Corporation> = {
          allianceId: corp.alliance_id,
          ceoId: corp.ceo_id,
          description: corp.description,
          factionId: corp.faction_id,
          homeStationId: corp.home_station_id,
          memberCount: corp.member_count,
          shares: corp.shares,
          taxRate: corp.tax_rate,
          url: corp.url,
        };

        await db.Corporation.query()
          .findById(id)
          .patch(update);
      } else {
        inserted++;
        await db.Corporation.query().insert({
          id: id,
          allianceId: corp.alliance_id,
          ceoId: corp.ceo_id,
          creatorId: corp.creator_id,
          dateFounded: moment(corp.date_founded).toDate(),
          description: corp.description,
          factionId: corp.faction_id,
          homeStationId: corp.home_station_id,
          memberCount: corp.member_count,
          name: corp.name,
          shares: corp.shares,
          taxRate: corp.tax_rate,
          ticker: corp.ticker,
          url: corp.url,
          warEligible: corp.war_eligible,
        });
      }
    }
    logger.info(`Updated ${updated} corporations, inserted ${inserted} new ones`);
  } catch (e) {
    logger.error(`Failure updating corporations: ${e.message}`);
  }
};
