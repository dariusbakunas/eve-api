import { Model } from 'objection';

export class IndustryActivityProduct extends Model {
  static tableName = 'industryActivityProducts';

  typeID!: number;
  activityID!: number;
  productTypeID!: number;
  quantity!: number;
}
