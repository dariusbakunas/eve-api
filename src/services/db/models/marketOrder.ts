import { Model } from 'objection';

export class MarketOrder extends Model {
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
