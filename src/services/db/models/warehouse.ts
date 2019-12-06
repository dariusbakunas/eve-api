import BaseModel from './base';
import { Model } from 'objection';
import { User } from './user';

export class Warehouse extends BaseModel {
  static tableName = 'warehouses';

  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'warehouses.ownerId',
        to: 'users.id',
      },
    },
  };

  readonly id!: number;
  ownerId!: number;
  name!: string;
}
