import { Character } from '../services/db/models/character';
import { cleanup } from './cleanup';
import { getAccessToken } from '../resolvers/common';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { processAlliances } from './processAlliances';
import { processBookmarks } from './processBookmarks';
import { processCorporations } from './processCorporations';
import { processJournalEntries } from './processJournalEntries';
import { processMarketOrders } from './processMarketOrders';
import { processSkills } from './processSkills';
import { processWalletTransactions } from './processWalletTransactions';
import { updateNameCache } from './updateNameCache';
import Crypt from '../services/crypt';
import db from '../services/db';
import EsiAPI from '../services/esi/api';
import EsiAuth from '../services/esi/auth';
import logger from '../utils/logger';

const initDataSources = () => {
  const dataSources = {
    esiAuth: new EsiAuth(process.env.EVE_LOGIN_URL!),
    esiApi: new EsiAPI(process.env.EVE_ESI_URL!, new InMemoryLRUCache()),
    db: db,
    crypt: new Crypt(process.env.TOKEN_SECRET!),
  };

  dataSources.esiApi.initialize({ context: null, cache: new InMemoryLRUCache() });
  dataSources.esiAuth.initialize({ context: null, cache: new InMemoryLRUCache() });

  return dataSources;
};

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
        await processMarketOrders(character, token, db, esiApi);
      }

      if (scopes.includes('esi-skills.read_skills.v1')) {
        await processSkills(character, token, db, esiApi);
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
