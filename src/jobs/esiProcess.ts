import { Character } from '../services/db/models/character';
import { cleanup } from './cleanup';
import { getAccessToken } from '../resolvers/common';
import { initDataSources } from './initDataSources';
import { processAlliances } from './processAlliances';
import { processBlueprints } from './processBlueprints';
import { processBookmarks } from './processBookmarks';
import { processCharacterMarketOrders } from './processCharacterMarketOrders';
import { processCorporations } from './processCorporations';
import { processJournalEntries } from './processJournalEntries';
import { processSkillQueue } from './prrocessSkillQueue';
import { processSkills } from './processSkills';
import { processWalletTransactions } from './processWalletTransactions';
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

      if (scopes.includes('esi-wallet.read_character_wallet.v1')) {
        await processWalletTransactions(character, token, db, esiApi);
        await processJournalEntries(character, token, db, esiApi);
      }

      if (scopes.includes('esi-bookmarks.read_character_bookmarks.v1')) {
        await processBookmarks(character, token, db, esiApi);
      }

      if (scopes.includes('esi-markets.read_character_orders.v1')) {
        await processCharacterMarketOrders(character, token, db, esiApi);
      }

      if (scopes.includes('esi-skills.read_skills.v1')) {
        await processSkills(character, token, db, esiApi);
        await processSkillQueue(character, token, db, esiApi);
      }

      if (scopes.includes('esi-characters.read_blueprints.v1')) {
        await processBlueprints(character, token, db, esiApi);
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
