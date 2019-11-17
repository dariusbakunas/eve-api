import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import logger from '../utils/logger';
import { IBookmark } from '../services/esi/api';

const CITADEL_GROUP_ID = 1657;

// TODO: add custom scope/rule to limit who can submit these bookmarks
export const processBookmarks = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
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
  const citadelBookmarks = allBookmarks.filter((bookmark: IBookmark) => {
    return bookmark.item && citadelIdSet.has(bookmark.item.typeId) && !existingIdSet.has(bookmark.item.id);
  });

  for (let i = 0; i < citadelBookmarks.length; i++) {
    const citadel = citadelBookmarks[i];
    const name = citadel.label.replace('\t', '');
    logger.info(`Inserting new citadel: ${name}`);
    await db.CitadelCacheItem.query().insert({
      id: citadel.item!.id,
      name: name,
      systemId: citadel.locationId,
      typeId: citadel.item!.typeId,
      creatorId: character.id,
      createdAt: citadel.created,
    });
  }
};
