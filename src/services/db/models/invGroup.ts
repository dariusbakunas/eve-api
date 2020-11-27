import { Model } from 'objection';

export class InvGroup extends Model {
  static tableName = 'invGroups';

  static get idColumn() {
    return 'groupID';
  }

  readonly groupID!: number;
  categoryID!: number;
  groupName!: string;
  iconID?: number;
  useBasePrice!: boolean;
  anchored!: boolean;
  anchorable!: boolean;
  fittableNonsingleton!: boolean;
  published!: boolean;
}
