import BaseModel from './base';

export class InvGroup extends BaseModel {
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
