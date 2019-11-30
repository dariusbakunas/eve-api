import BaseModel from './base';

export class SkillMultiplier extends BaseModel {
  static tableName = 'skillMultipliers';

  readonly skillId!: number;
  multiplier!: number;
}
