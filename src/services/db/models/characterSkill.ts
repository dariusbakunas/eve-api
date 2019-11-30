import BaseModel from './base';

export class CharacterSkill extends BaseModel {
  static tableName = 'characterSkills';

  activeSkillLevel!: number;
  skillId!: number;
  skillPointsInSkill!: number;
  trainedSkillLevel!: number;
  characterId!: number;
}
