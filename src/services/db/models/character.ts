import { Model } from 'objection';
import { User } from './user';
import BaseModel from './base';

export class Character extends BaseModel {
  static tableName = 'characters';
  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'characters.ownerId',
        to: 'users.id',
      },
    },
  };

  readonly id!: number;
  name!: string;
  accessToken!: string;
  refreshToken!: string;
  expiresAt!: number;
  scopes!: string;
}
