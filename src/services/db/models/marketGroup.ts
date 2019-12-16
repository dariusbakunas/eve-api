import BaseModel from './base';

export class MarketGroup extends BaseModel {
  static tableName = 'invMarketGroups';

  static get idColumn() {
    return 'marketGroupID';
  }

  readonly marketGroupID!: number;
  parentGroupID?: number;
  marketGroupName!: string;
  description?: string;
  iconID?: number;
  hasTypes!: boolean;
}
