import BaseModel from './base';

export class IndustryJob extends BaseModel {
  static tableName = 'industryJobs';

  readonly id!: number;
  activityId!: number;
  blueprintId!: number;
  blueprintLocationId!: number;
  blueprintTypeId!: number;
  completedCharacterId?: number;
  completedDate?: Date;
  cost?: number;
  duration!: number;
  endDate!: Date;
  facilityId!: number;
  installerId!: number;
  licensedRuns?: number;
  outputLocationId!: number;
  pauseDate?: Date;
  probability?: number;
  productTypeId?: number;
  runs!: number;
  startDate!: Date;
  stationId!: number;
  status!: string;
  successfulRuns?: number;
}
