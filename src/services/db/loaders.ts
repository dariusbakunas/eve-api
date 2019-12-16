import { Character } from './models/character';
import { IDataSources } from '../index';
import { InventoryItem } from './models/InventoryItem';
import { InvGroup } from './models/invGroup';
import { MarketGroup } from './models/marketGroup';
import { Maybe } from '../../types';
import { Station } from './models/station';
import DataLoader from 'dataloader';
import logger from '../../utils/logger';

export class Loaders {
  private db: IDataSources['db'];
  public invGroupLoader: DataLoader<number, Maybe<InvGroup>>;
  public marketGroupLoader: DataLoader<number, Maybe<MarketGroup>>;
  public invItemLoader: DataLoader<number, Maybe<InventoryItem>>;
  public characterLoader: DataLoader<number, Maybe<Character>>;
  public stationLoader: DataLoader<number, Maybe<Station>>;

  constructor(db: IDataSources['db']) {
    this.db = db;
    this.invItemLoader = new DataLoader(ids => this.loadInvItems(ids));
    this.characterLoader = new DataLoader(ids => this.loadCharacters(ids));
    this.stationLoader = new DataLoader(ids => this.loadStations(ids));
    this.invGroupLoader = new DataLoader(ids => this.loadInvGroups(ids));
    this.marketGroupLoader = new DataLoader(ids => this.loadMarketGroups(ids));
  }

  private mapItems<T>(ids: number[], items: T[], idGetter: (item: T) => number) {
    const idMap = items.reduce<{ [key: number]: T }>((acc, item) => {
      acc[idGetter(item)] = item;
      return acc;
    }, {});

    return ids.map(id => {
      const item = idMap[id];
      return item || null;
    });
  }

  private async loadStations(ids: number[]) {
    const stations: Array<Station> = await this.db.Station.query().where('stationID', 'in', ids);
    return this.mapItems<Station>(ids, stations, station => station.stationID);
  }

  private async loadCharacters(ids: number[]) {
    const characters: Array<Character> = await this.db.Character.query().where('id', 'in', ids);
    return this.mapItems<Character>(ids, characters, character => character.id);
  }

  private async loadInvGroups(ids: number[]) {
    const invGroups: Array<InvGroup> = await this.db.InvGroup.query().where('groupID', 'in', ids);
    return this.mapItems<InvGroup>(ids, invGroups, invGroup => invGroup.groupID);
  }

  private async loadMarketGroups(ids: number[]) {
    const marketGroups: Array<MarketGroup> = await this.db.MarketGroup.query().where('marketGroupID', 'in', ids);
    return this.mapItems<MarketGroup>(ids, marketGroups, marketGroup => marketGroup.marketGroupID);
  }

  private async loadInvItems(ids: number[]) {
    logger.debug(`loaders.loadInvItems, ids: ${ids.join(',')}`);
    const invItems: Array<InventoryItem> = await this.db.InventoryItem.query().where('typeID', 'in', ids);
    return this.mapItems<InventoryItem>(ids, invItems, item => item.typeID);
  }
}
