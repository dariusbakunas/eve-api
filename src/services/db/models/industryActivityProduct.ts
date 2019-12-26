import BaseModel from './base';

export class IndustryActivityProduct extends BaseModel {
  static tableName = 'industryActivityProducts';

  typeID!: number;
  activityID!: number;
  productTypeID!: number;
  quantity!: number;
}
