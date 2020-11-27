import { Model } from 'objection';

export class IndustryBlueprint extends Model {
  static tableName = 'industryBlueprints';

  typeID!: number;
  maxProductionLimit!: number;
}
