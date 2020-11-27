import { Model } from 'objection';

export class Blueprint extends Model {
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
