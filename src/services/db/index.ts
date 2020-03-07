import { Alliance } from './models/alliance';
import { Character } from './models/character';
import { CharacterMarketOrder } from './models/characterMarketOrder';
import { CharacterSkill } from './models/characterSkill';
import { CitadelCacheItem } from './models/citadelCacheItem';
import { Corporation } from './models/corporation';
import { IDataSources } from '../index';
import { InvCategory } from './models/InvCategory';
import { InventoryItem } from './models/InventoryItem';
import { InvGroup } from './models/invGroup';
import { Invitation } from './models/invitation';
import { JobLogEntry } from './models/jobLogEntry';
import { JournalEntry } from './models/journalEntry';
import { NameCacheItem } from './models/nameCacheItem';
import { Scope } from './models/scope';
import { SkillMultiplier } from './models/skillMultiplier';
import { Station } from './models/station';
import { User } from './models/user';
import { WalletTransaction } from './models/walletTransaction';
import { Warehouse } from './models/warehouse';
import { WarehouseItem } from './models/warehouseItem';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { Blueprint } from './models/blueprint';
import { IndustryActivity } from './models/industryActivity';
import { IndustryActivityMaterial } from './models/industryActivityMaterial';
import { IndustryActivityProduct } from './models/industryActivityProduct';
import { IndustryBlueprint } from './models/industryBlueprints';
import { IndustryJob } from './models/industryJob';
import { MarketGroup } from './models/marketGroup';
import { MarketOrder } from './models/marketOrder';
import { MarketPrice } from './models/MarketPrice';
import { SkillQueueItem } from './models/skillQueueItem';

const db: IDataSources['db'] = {
  Alliance,
  Blueprint,
  Character,
  CharacterSkill,
  Corporation,
  NameCacheItem,
  CharacterMarketOrder,
  InvCategory,
  JournalEntry,
  JobLogEntry,
  User,
  Scope,
  InvGroup,
  Invitation,
  IndustryBlueprint,
  IndustryActivityProduct,
  IndustryActivityMaterial,
  IndustryActivity,
  IndustryJob,
  InventoryItem,
  MarketGroup,
  MarketOrder,
  MarketPrice,
  SkillQueueItem,
  SkillMultiplier,
  Station,
  CitadelCacheItem,
  WalletTransaction,
  Warehouse,
  WarehouseItem,
};

export default db;
