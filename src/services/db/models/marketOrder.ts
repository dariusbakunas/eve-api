import BaseModel from './base';

export class MarketOrder extends BaseModel {
  static tableName = 'marketOrders';

  readonly id!: number;
  duration!: number;
  isBuy!: boolean;
  issued!: Date;
  locationId!: number;
  minVolume!: number;
  price!: number;
  range!: string;
  systemId!: number;
  typeId!: number;
  volumeRemain!: number;
  volumeTotal!: number;
}
