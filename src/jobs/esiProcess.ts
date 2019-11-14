import EsiAPI from '../services/esi/api';
import db from '../services/db';
import { Character } from '../services/db/models/character';
import { getAccessToken } from '../resolvers/common';
import Crypt from '../services/crypt';
import EsiAuth from '../services/esi/auth';
import logger from '../utils/logger';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { processWalletTransactions } from './processWalletTransactions';
import { processJournalEntries } from './processJournalEntries';
import { updateNameCache } from './updateNameCache';

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
      const token = await getAccessToken(
        id,
        accessToken,
        refreshToken,
        expiresAt,
        db,
        crypt,
        esiAuth
      );

      if (scopes.includes('esi-wallet.read_character_wallet.v1')) {
        await processWalletTransactions(character, token, db, esiApi);
        await processJournalEntries(character, token, db, esiApi);
      }
    } catch (e) {
      logger.error(e);
    }
  }

  try {
    await updateNameCache(db, esiApi);
  } catch (e) {
    logger.error(e);
  }
};
