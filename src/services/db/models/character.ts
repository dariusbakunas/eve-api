import { Model } from 'objection';
import { User } from './user';

export class Character extends Model {
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
