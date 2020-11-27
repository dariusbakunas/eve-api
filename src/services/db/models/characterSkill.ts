import { Model } from 'objection';

export class CharacterSkill extends Model {
  static tableName = 'characterSkills';

  activeSkillLevel!: number;
  skillId!: number;
  skillPointsInSkill!: number;
  trainedSkillLevel!: number;
  characterId!: number;
}
