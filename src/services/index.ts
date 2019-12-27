import { Alliance } from './db/models/alliance';
import { Blueprint } from './db/models/blueprint';
import { Character } from './db/models/character';
import { CharacterSkill } from './db/models/characterSkill';
import { CitadelCacheItem } from './db/models/citadelCacheItem';
import { Corporation } from './db/models/corporation';
import { IndustryActivity } from './db/models/industryActivity';
import { IndustryActivityMaterial } from './db/models/industryActivityMaterial';
import { IndustryActivityProduct } from './db/models/industryActivityProduct';
import { IndustryBlueprint } from './db/models/industryBlueprints';
import { InvCategory } from './db/models/InvCategory';
import { InventoryItem } from './db/models/InventoryItem';
import { InvGroup } from './db/models/invGroup';
import { Invitation } from './db/models/invitation';
import { JobLogEntry } from './db/models/jobLogEntry';
import { JournalEntry } from './db/models/journalEntry';
import { Loaders } from './db/loaders';
import { MarketGroup } from './db/models/marketGroup';
import { MarketOrder } from './db/models/marketOrder';
import { NameCacheItem } from './db/models/nameCacheItem';
import { RedisCache } from 'apollo-server-cache-redis';
import { Scope } from './db/models/scope';
import { SkillMultiplier } from './db/models/skillMultiplier';
import { Station } from './db/models/station';
import { User } from './db/models/user';
import { WalletTransaction } from './db/models/walletTransaction';
import { Warehouse } from './db/models/warehouse';
import { WarehouseItem } from './db/models/warehouseItem';
import Crypt from './crypt';
import db from './db';
import EsiAPI from './esi/api';
import EsiAuth from './esi/auth';
import { SkillQueueItem } from './db/models/skillQueueItem';

const redisCache = new RedisCache({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export interface IDataSources {
  db: {
    Alliance: typeof Alliance;
    Blueprint: typeof Blueprint;
    Character: typeof Character;
    CharacterSkill: typeof CharacterSkill;
    Corporation: typeof Corporation;
    NameCacheItem: typeof NameCacheItem;
    MarketOrder: typeof MarketOrder;
    JournalEntry: typeof JournalEntry;
    JobLogEntry: typeof JobLogEntry;
    MarketGroup: typeof MarketGroup;
    IndustryBlueprint: typeof IndustryBlueprint;
    InvCategory: typeof InvCategory;
    IndustryActivity: typeof IndustryActivity;
    IndustryActivityMaterial: typeof IndustryActivityMaterial;
    IndustryActivityProduct: typeof IndustryActivityProduct;
    User: typeof User;
    Scope: typeof Scope;
    SkillQueueItem: typeof SkillQueueItem;
    Invitation: typeof Invitation;
    InvGroup: typeof InvGroup;
    InventoryItem: typeof InventoryItem;
    SkillMultiplier: typeof SkillMultiplier;
    Station: typeof Station;
    CitadelCacheItem: typeof CitadelCacheItem;
    WalletTransaction: typeof WalletTransaction;
    Warehouse: typeof Warehouse;
    WarehouseItem: typeof WarehouseItem;
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
