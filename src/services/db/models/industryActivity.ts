import { Model } from 'objection';

export class IndustryActivity extends Model {
  static tableName = 'industryActivity';

  typeID!: number;
  activityID!: number;
  time!: number;
}
