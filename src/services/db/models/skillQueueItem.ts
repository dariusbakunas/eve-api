import { Model } from 'objection';

export class SkillQueueItem extends Model {
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
