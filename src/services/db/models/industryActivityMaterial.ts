import { Model } from 'objection';

export class IndustryActivityMaterial extends Model {
  static tableName = 'industryActivityMaterials';

  typeID!: number;
  activityID!: number;
  materialTypeID!: number;
  quantity!: number;
}
