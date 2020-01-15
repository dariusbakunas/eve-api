import BaseModel from './base';

export class MarketPrice extends BaseModel {
  static tableName = 'marketPrices';

  buyPrice!: number;
  sellPrice!: number;
  systemId!: number;
  typeId!: number;
}
