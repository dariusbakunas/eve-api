import BaseModel from './base';

export class IndustryBlueprint extends BaseModel {
  static tableName = 'industryBlueprints';

  typeID!: number;
  maxProductionLimit!: number;
}
