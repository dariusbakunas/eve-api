import { Character } from '../services/db/models/character';
import { cleanup } from './cleanup';
import { getAccessToken } from '../resolvers/common';
import { initDataSources } from './initDataSources';
import { processAlliances } from './processAlliances';
import { processBookmarks } from './processBookmarks';
import { processCorporations } from './processCorporations';
import { updateNameCache } from './updateNameCache';
import logger from '../utils/logger';

export const processData = async () => {
  const { db, crypt, esiAuth, esiApi } = initDataSources();
  const characters = await db.Character.query();

  for (let i = 0; i < characters.length; i++) {
    const character: Character = characters[i];
    const { id, accessToken, refreshToken, expiresAt, scopes } = character;

    try {
      const token = await getAccessToken(id, accessToken, refreshToken, expiresAt, db, crypt, esiAuth);

      if (scopes.includes('esi-bookmarks.read_character_bookmarks.v1')) {
        await processBookmarks(character, token, db, esiApi);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  try {
    await updateNameCache(db, esiApi);
    await processCorporations(db, esiApi);
    await processAlliances(db, esiApi);
    await cleanup(db);
  } catch (e) {
    logger.error(e);
  }
};
