import BaseModel from './base';

export class MarketOrder extends BaseModel {
  static tableName = 'marketOrders';

  readonly id!: number;
  duration!: number;
  escrow?: number;
  isBuy!: boolean;
  isCorporation!: boolean;
  issued!: Date;
  locationId!: number;
  minVolume?: number;
  price!: number;
  range!: string;
  regionId!: number;
  typeId!: number;
  state!: 'active' | 'cancelled' | 'expired';
  volumeRemain!: number;
  volumeTotal!: number;
}
