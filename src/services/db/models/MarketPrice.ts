import { Model } from 'objection';

export class MarketPrice extends Model {
  static tableName = 'marketPrices';

  buyPrice!: number;
  sellPrice!: number;
  systemId!: number;
  typeId!: number;
}
