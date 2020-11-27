import { Model } from 'objection';

export class MarketGroup extends Model {
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
