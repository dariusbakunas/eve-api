import { IDataSources } from '../index';
import DataLoader from 'dataloader';
import { InventoryItem } from './models/InventoryItem';
import logger from '../../utils/logger';
import { Character } from './models/character';
import { Maybe } from '../../types';

export class Loaders {
  private db: IDataSources['db'];
  public invItemLoader: DataLoader<number, Maybe<InventoryItem>>;
  public characterLoader: DataLoader<number, Maybe<Character>>;

  constructor(db: IDataSources['db']) {
    this.db = db;
    this.invItemLoader = new DataLoader(ids => this.loadInvItems(ids));
    this.characterLoader = new DataLoader(ids => this.loadCharacters(ids));
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

  private async loadCharacters(ids: number[]) {
    const characters: Array<Character> = await this.db.Character.query().where('id', 'in', ids);
    return this.mapItems<Character>(ids, characters, character => character.id);
  }

  private async loadInvItems(ids: number[]) {
    logger.debug(`loaders.loadInvItems, ids: ${ids.join(',')}`);
    const invItems: Array<InventoryItem> = await this.db.InventoryItem.query().where(
      'typeID',
      'in',
      ids
    );

    return this.mapItems<InventoryItem>(ids, invItems, item => item.typeID);
  }
}
