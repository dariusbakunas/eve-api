import { Alliance } from './models/alliance';
import { Character } from './models/character';
import { CharacterSkill } from './models/characterSkill';
import { CitadelCacheItem } from './models/citadelCacheItem';
import { Corporation } from './models/corporation';
import { IDataSources } from '../index';
import { InventoryItem } from './models/InventoryItem';
import { InvGroup } from './models/invGroup';
import { Invitation } from './models/invitation';
import { JobLogEntry } from './models/jobLogEntry';
import { JournalEntry } from './models/journalEntry';
import { MarketOrder } from './models/marketOrder';
import { Model } from 'objection';
import { NameCacheItem } from './models/nameCacheItem';
import { Scope } from './models/scope';
import { SkillMultiplier } from './models/skillMultiplier';
import { Station } from './models/station';
import { User } from './models/user';
import { WalletTransaction } from './models/walletTransaction';
import { Warehouse } from './models/warehouse';
import { WarehouseItem } from './models/warehouseItem';
import Knex from 'knex';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { MarketGroup } from './models/marketGroup';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../../knexfile');

const knex = Knex(config[process.env.NODE_ENV!]);

//knex.migrate.latest();
Model.knex(knex);

const db: IDataSources['db'] = {
  Alliance,
  Character,
  CharacterSkill,
  Corporation,
  NameCacheItem,
  MarketOrder,
  JournalEntry,
  JobLogEntry,
  User,
  Scope,
  InvGroup,
  Invitation,
  InventoryItem,
  MarketGroup,
  SkillMultiplier,
  Station,
  CitadelCacheItem,
  WalletTransaction,
  Warehouse,
  WarehouseItem,
};

export default db;
