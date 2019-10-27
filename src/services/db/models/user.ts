import { Model, RelationMappings } from 'objection';
import { Character } from './character';
import { Maybe } from '../../../types';

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export class User extends Model {
  static tableName = 'users';

  readonly id!: number;
  username!: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
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
  };
}
