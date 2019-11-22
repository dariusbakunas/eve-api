import logger from '../utils/logger';
import { IDataSources } from '../services';

export const updateNameCache = async (db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Updating item name cache`);
  let newIds = [];

  try {
    const transactionClientIds = await db.WalletTransaction.query()
      .select('clientId')
      .distinct('clientId')
      .pluck('clientId');

    const journalFirstPartyIds = await db.JournalEntry.query()
      .select('firstPartyId')
      .distinct('firstPartyId')
      .pluck('firstPartyId');

    const journalSecondPartyIds = await db.JournalEntry.query()
      .select('secondPartyId')
      .distinct('secondPartyId')
      .pluck('secondPartyId');

    const ids = new Set([...transactionClientIds, ...journalFirstPartyIds, ...journalSecondPartyIds]);

    const cacheIds = await db.NameCacheItem.query()
      .select('id')
      .pluck('id');

    const cacheIdSet = new Set(cacheIds);
    newIds = [...ids].filter((id: number) => !cacheIdSet.has(id));
  } catch (e) {
    logger.error(e);
  }

  if (newIds.length) {
    logger.info(`Inserting ${newIds.length} new names`);
    const names = await esiApi.getUniverseNames(newIds);

    for (let i = 0; i < names.length; i++) {
      try {
        const { id, category, name } = names[i];
        await db.NameCacheItem.query().insert({ id: id, name: name, category: category });
      } catch (e) {
        logger.error(e);
      }
    }
  } else {
    logger.info('No new ids detected');
  }
};
