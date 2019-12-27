import BaseModel from './base';

export class SkillQueueItem extends BaseModel {
  static tableName = 'characterSkillQueue';

  skillId!: number;
  characterId!: number;
  finishDate?: Date;
  finishedLevel!: number;
  levelEndSp?: number;
  levelStartSp?: number;
  queuePosition!: number;
  startDate?: Date;
  trainingStartSp?: number;
}
