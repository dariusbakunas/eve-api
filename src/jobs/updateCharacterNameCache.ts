import logger from '../utils/logger';
import { IDataSources } from '../services';

export const updateCharacterNameCache = async (
  db: IDataSources['db'],
  esiApi: IDataSources['esiApi']
) => {
  logger.info(`Updating character name cache`);
  let newIds = [];

  try {
    const clientIds = await db.WalletTransaction.query()
      .select('clientId')
      .distinct('clientId')
      .pluck('clientId');

    const cacheIds = await db.CharacterNameCacheItem.query()
      .select('id')
      .pluck('id');

    const idSet = new Set(cacheIds);
    newIds = clientIds.filter((id: number) => !idSet.has(id));
  } catch (e) {
    logger.error(e);
  }

  if (newIds.length) {
    logger.info(`Inserting ${newIds.length} new names`);

    for (let i = 0; i < newIds.length; i++) {
      try {
        const id = newIds[i];
        const character = await esiApi.getCharacterInfo(id);
        await db.CharacterNameCacheItem.query().insert({ id: id, name: character.name });
      } catch (e) {
        logger.error(e);
      }
    }
  } else {
    logger.info('No new character ids detected');
  }
};
