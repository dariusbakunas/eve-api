import BaseModel from './base';

export class IndustryActivity extends BaseModel {
  static tableName = 'industryActivity';

  typeID!: number;
  activityID!: number;
  time!: number;
}
