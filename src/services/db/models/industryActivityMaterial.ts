import BaseModel from './base';

export class IndustryActivityMaterial extends BaseModel {
  static tableName = 'industryActivityMaterials';

  typeID!: number;
  activityID!: number;
  materialTypeID!: number;
  quantity!: number;
}
