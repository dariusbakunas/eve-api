import BaseModel from './base';

export class Blueprint extends BaseModel {
  static tableName = 'blueprints';

  readonly id!: number;
  locationType!: string;
  locationId!: number;
  groupName!: string;
  materialEfficiency!: number;
  isCopy!: boolean;
  maxRuns!: number;
  timeEfficiency!: number;
  typeId!: number;
  characterId!: number;
}
