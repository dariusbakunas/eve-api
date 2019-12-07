import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import { IEsiBookmark } from '../services/esi/esiTypes';
import logger from '../utils/logger';
import moment from 'moment';

const CITADEL_GROUP_ID = 1657;

// TODO: add custom scope/rule to limit who can submit these bookmarks
export const processBookmarks = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  try {
    logger.info(`Getting bookmarks for character: ${character.name}`);
    const allBookmarks = await esiApi.getBookmarks(character.id, token);
    const citadelIds = await db.InventoryItem.query()
      .select('typeID')
      .where('groupID', '=', CITADEL_GROUP_ID)
      .pluck('typeID');
    const citadelIdSet = new Set(citadelIds);
    const existingStructures = await db.CitadelCacheItem.query()
      .select('id')
      .pluck('id');

    const existingIdSet = new Set(existingStructures);
    const citadelBookmarks = allBookmarks.filter((bookmark: IEsiBookmark) => {
      return bookmark.item && citadelIdSet.has(bookmark.item.type_id) && !existingIdSet.has(bookmark.item.item_id);
    });

    let inserted = 0;
    for (let i = 0; i < citadelBookmarks.length; i++) {
      const citadel = citadelBookmarks[i];
      const name = citadel.label.replace('\t', '');
      logger.info(`Inserting new citadel: ${name}`);
      inserted++;
      await db.CitadelCacheItem.query().insert({
        id: citadel.item!.item_id,
        name: name,
        systemId: citadel.location_id,
        typeId: citadel.item!.type_id,
        creatorId: character.id,
        createdAt: moment(citadel.created).toDate(),
      });
    }
    const message = inserted > 0 ? `Inserted ${inserted} new citadels` : 'No new citadels found';
    logger.info(`${message} for ${character.name}`);
    await db.JobLogEntry.query().insert({
      category: 'BOOKMARKS',
      status: 'SUCCESS',
      message: message,
      characterId: character.id,
    });
  } catch (e) {
    logger.error(`Failed to get bookmarks for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'BOOKMARKS',
      status: 'FAILURE',
      message: 'Failed to get bookmarks',
      error: e.message,
      characterId: character.id,
    });
  }
};
