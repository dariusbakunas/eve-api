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
import { NameCacheItem } from './db/models/nameCacheItem';
import { CitadelCacheItem } from './db/models/citadelCacheItem';
import { MarketOrder } from './db/models/marketOrder';
import { JobLogEntry } from './db/models/jobLogEntry';
import { Corporation } from './db/models/corporation';
import { Alliance } from './db/models/alliance';
import { CharacterSkill } from './db/models/characterSkill';
import { InvGroup } from './db/models/invGroup';
import { SkillMultiplier } from './db/models/skillMultiplier';
import { Warehouse } from './db/models/warehouse';

const redisCache = new RedisCache({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export interface IDataSources {
  db: {
    Alliance: typeof Alliance;
    Character: typeof Character;
    CharacterSkill: typeof CharacterSkill;
    Corporation: typeof Corporation;
    NameCacheItem: typeof NameCacheItem;
    MarketOrder: typeof MarketOrder;
    JournalEntry: typeof JournalEntry;
    JobLogEntry: typeof JobLogEntry;
    User: typeof User;
    Scope: typeof Scope;
    Invitation: typeof Invitation;
    InvGroup: typeof InvGroup;
    InventoryItem: typeof InventoryItem;
    SkillMultiplier: typeof SkillMultiplier;
    Station: typeof Station;
    CitadelCacheItem: typeof CitadelCacheItem;
    WalletTransaction: typeof WalletTransaction;
    Warehouse: typeof Warehouse;
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
