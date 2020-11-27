import { Model } from 'objection';

export class SkillMultiplier extends Model {
  static tableName = 'skillMultipliers';

  readonly skillId!: number;
  multiplier!: number;
}
