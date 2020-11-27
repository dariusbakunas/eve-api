import { Character } from './models/character';
import { IDataSources } from '../index';
import { InvCategory } from './models/InvCategory';
import { InventoryItem } from './models/InventoryItem';
import { InvGroup } from './models/invGroup';
import { MarketGroup } from './models/marketGroup';
import { Maybe } from '../../types';
import { Station } from './models/station';
import { Warehouse } from './models/warehouse';
import DataLoader from 'dataloader';
import logger from '../../utils/logger';

export class Loaders {
  private db: IDataSources['db'];
  public invGroupLoader: DataLoader<number, Maybe<InvGroup>>;
  public marketGroupLoader: DataLoader<number, Maybe<MarketGroup>>;
  public invItemLoader: DataLoader<number, Maybe<InventoryItem>>;
  public invCategoryLoader: DataLoader<number, Maybe<InvCategory>>;
  public characterLoader: DataLoader<number, Maybe<Character>>;
  public stationLoader: DataLoader<number, Maybe<Station>>;
  public warehouseLoader: DataLoader<number, Maybe<Warehouse>>;

  constructor(db: IDataSources['db']) {
    this.db = db;
    this.invItemLoader = new DataLoader((ids) => this.loadInvItems(ids));
    this.invCategoryLoader = new DataLoader((ids) => this.loadInvCategories(ids));
    this.characterLoader = new DataLoader((ids) => this.loadCharacters(ids));
    this.stationLoader = new DataLoader((ids) => this.loadStations(ids));
    this.invGroupLoader = new DataLoader((ids) => this.loadInvGroups(ids));
    this.marketGroupLoader = new DataLoader((ids) => this.loadMarketGroups(ids));
    this.warehouseLoader = new DataLoader((ids) => this.loadWarehouses(ids));
  }

  private mapItems<T>(ids: readonly number[], items: T[], idGetter: (item: T) => number) {
    const idMap = items.reduce<{ [key: number]: T }>((acc, item) => {
      acc[idGetter(item)] = item;
      return acc;
    }, {});

    return ids.map((id) => {
      const item = idMap[id];
      return item || null;
    });
  }

  private async loadStations(ids: readonly number[]) {
    const stations: Array<Station> = await this.db.Station.query().where('stationID', 'in', [...ids]);
    return this.mapItems<Station>(ids, stations, (station) => station.stationID);
  }

  private async loadCharacters(ids: readonly number[]) {
    const characters: Array<Character> = await this.db.Character.query().where('id', 'in', [...ids]);
    return this.mapItems<Character>(ids, characters, (character) => character.id);
  }

  private async loadInvGroups(ids: readonly number[]) {
    const invGroups: Array<InvGroup> = await this.db.InvGroup.query().where('groupID', 'in', [...ids]);
    return this.mapItems<InvGroup>(ids, invGroups, (invGroup) => invGroup.groupID);
  }

  private async loadInvCategories(ids: readonly number[]) {
    const invCategories: Array<InvCategory> = await this.db.InvCategory.query().where('categoryID', 'in', [...ids]);
    return this.mapItems<InvCategory>(ids, invCategories, (invCategory) => invCategory.categoryID);
  }

  private async loadMarketGroups(ids: readonly number[]) {
    const marketGroups: Array<MarketGroup> = await this.db.MarketGroup.query().where('marketGroupID', 'in', [...ids]);
    return this.mapItems<MarketGroup>(ids, marketGroups, (marketGroup) => marketGroup.marketGroupID);
  }

  private async loadWarehouses(ids: readonly number[]) {
    const warehouses: Array<Warehouse> = await this.db.Warehouse.query().where('id', 'in', [...ids]);
    return this.mapItems<Warehouse>(ids, warehouses, (warehouse) => warehouse.id);
  }

  private async loadInvItems(ids: readonly number[]) {
    logger.debug(`loaders.loadInvItems, ids: ${ids.join(',')}`);
    const invItems: Array<InventoryItem> = await this.db.InventoryItem.query()
      .select('invTypes.*', 'invGroup.categoryID')
      .join('invGroups as invGroup', 'invTypes.groupID', 'invGroup.groupID')
      .where('typeID', 'in', [...ids]);
    return this.mapItems<InventoryItem>(ids, invItems, (item) => item.typeID);
  }
}
