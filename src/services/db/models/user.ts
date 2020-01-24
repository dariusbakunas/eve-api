import { Character } from './character';
import { Model, RelationMappings } from 'objection';
import { Warehouse } from './warehouse';
import BaseModel from './base';

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export class User extends BaseModel {
  static tableName = 'users';

  readonly id!: number;
  username!: string;
  status!: UserStatus;
  email!: string;

  static relationMappings: RelationMappings = {
    characters: {
      relation: Model.HasManyRelation,
      // This model defines the `modelPaths` property. Therefore we can simply use
      // the model module names in `modelClass`.
      modelClass: Character,
      join: {
        from: 'users.id',
        to: 'characters.ownerId',
      },
    },
    warehouses: {
      relation: Model.HasManyRelation,
      modelClass: Warehouse,
      join: {
        from: 'users.id',
        to: 'warehouses.ownerId',
      },
    },
  };
}
