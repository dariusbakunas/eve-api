import { InvGroup } from './invGroup';
import { Model } from 'objection';
import BaseModel from './base';

export class InventoryItem extends BaseModel {
  static tableName = 'invTypes';

  static get idColumn() {
    return 'typeID';
  }

  static relationMappings = {
    invGroup: {
      relation: Model.BelongsToOneRelation,
      modelClass: InvGroup,
      join: {
        from: 'invTypes.groupID',
        to: 'invGroups.groupID',
      },
    },
  };

  readonly typeID!: number;
  groupID!: number;
  categoryID?: number;
  description?: string;
  typeName?: string;
  mass?: number;
  volume?: number;
  marketGroupID?: number;

  // relations
  groupName!: string;
}
