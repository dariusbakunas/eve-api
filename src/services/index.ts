import { Loaders } from './db/loaders';
import EsiAuth from './esi/auth';
import EsiAPI from './esi/api';
import Crypt from './crypt';
import { Character } from './db/models/character';
import { User } from './db/models/user';
import { Scope } from './db/models/scope';
import { Invitation } from './db/models/invitation';
import { WalletTransaction } from './db/models/walletTransaction';
import { JournalEntry } from './db/models/journalEntry';
import { InventoryItem } from './db/models/InventoryItem';
import { Station } from './db/models/station';
import db from './db';
import { RedisCache } from 'apollo-server-cache-redis';
import { CharacterNameCacheItem } from './db/models/characterNameCacheItem';

const redisCache = new RedisCache({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export interface IDataSources {
  db: {
    Character: typeof Character;
    CharacterNameCacheItem: typeof CharacterNameCacheItem;
    JournalEntry: typeof JournalEntry;
    User: typeof User;
    Scope: typeof Scope;
    Invitation: typeof Invitation;
    InventoryItem: typeof InventoryItem;
    Station: typeof Station;
    WalletTransaction: typeof WalletTransaction;
  };
  loaders: Loaders;
  esiAuth: EsiAuth;
  esiApi: EsiAPI;
  crypt: Crypt;
  [key: string]: object;
}

export const dataSources: () => IDataSources = () => ({
  db,
  esiAuth: new EsiAuth(process.env.EVE_LOGIN_URL!),
  esiApi: new EsiAPI(process.env.EVE_ESI_URL!, redisCache),
  crypt: new Crypt(process.env.TOKEN_SECRET!),
  loaders: new Loaders(db),
});
