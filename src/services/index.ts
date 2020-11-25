import { Alliance } from './db/models/alliance';
import { applicationConfig } from '../utils/applicationConfig';
import { Blueprint } from './db/models/blueprint';
import { Character } from './db/models/character';
import { CharacterMarketOrder } from './db/models/characterMarketOrder';
import { CharacterSkill } from './db/models/characterSkill';
import { CitadelCacheItem } from './db/models/citadelCacheItem';
import { Corporation } from './db/models/corporation';
import { IndustryActivity } from './db/models/industryActivity';
import { IndustryActivityMaterial } from './db/models/industryActivityMaterial';
import { IndustryActivityProduct } from './db/models/industryActivityProduct';
import { IndustryBlueprint } from './db/models/industryBlueprints';
import { IndustryJob } from './db/models/industryJob';
import { InvCategory } from './db/models/InvCategory';
import { InventoryItem } from './db/models/InventoryItem';
import { InvGroup } from './db/models/invGroup';
import { Invitation } from './db/models/invitation';
import { JobLogEntry } from './db/models/jobLogEntry';
import { JournalEntry } from './db/models/journalEntry';
import { Loaders } from './db/loaders';
import { loadKnexConfig } from '../../loadKnexConfig';
import { MarketGroup } from './db/models/marketGroup';
import { MarketOrder } from './db/models/marketOrder';
import { MarketPrice } from './db/models/MarketPrice';
import { Model } from 'objection';
import { NameCacheItem } from './db/models/nameCacheItem';
import { Scope } from './db/models/scope';
import { SkillMultiplier } from './db/models/skillMultiplier';
import { SkillQueueItem } from './db/models/skillQueueItem';
import { Station } from './db/models/station';
import { User } from './db/models/user';
import { WalletTransaction } from './db/models/walletTransaction';
import { Warehouse } from './db/models/warehouse';
import { WarehouseItem } from './db/models/warehouseItem';
import Auth0API from './auth0';
import Crypt from './crypt';
import db from './db';
import EsiAPI from './esi/api';
import EsiAuth from './esi/auth';
import Knex from 'knex';

export interface IDataSources {
  db: {
    Alliance: typeof Alliance;
    Blueprint: typeof Blueprint;
    Character: typeof Character;
    CharacterSkill: typeof CharacterSkill;
    Corporation: typeof Corporation;
    NameCacheItem: typeof NameCacheItem;
    CharacterMarketOrder: typeof CharacterMarketOrder;
    JournalEntry: typeof JournalEntry;
    JobLogEntry: typeof JobLogEntry;
    MarketGroup: typeof MarketGroup;
    MarketOrder: typeof MarketOrder;
    IndustryBlueprint: typeof IndustryBlueprint;
    InvCategory: typeof InvCategory;
    IndustryActivity: typeof IndustryActivity;
    IndustryActivityMaterial: typeof IndustryActivityMaterial;
    IndustryActivityProduct: typeof IndustryActivityProduct;
    IndustryJob: typeof IndustryJob;
    MarketPrice: typeof MarketPrice;
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
  knex: Knex;
  loaders: Loaders;
  auth0Api: Auth0API;
  esiAuth: EsiAuth;
  esiApi: EsiAPI;
  crypt: Crypt;
  [key: string]: object;
}

export const dataSources: (knex: Knex) => IDataSources = (knex) => {
  const { config } = applicationConfig;

  return {
    knex,
    db,
    auth0Api: new Auth0API(`https://${config.auth0Domain}`),
    esiAuth: new EsiAuth(config.eveLoginUrl),
    esiApi: new EsiAPI(config.eveEsiUrl),
    crypt: new Crypt(config.tokenSecret),
    loaders: new Loaders(db),
  };
};
