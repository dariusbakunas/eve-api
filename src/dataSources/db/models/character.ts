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
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'name', 'accessToken', 'refreshToken', 'expiresAt'],
      properties: {
        id: { type: 'integer' },
        ownerId: { type: 'integer' },
        expiresAt: { type: 'integer' },
        name: { type: 'string' },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    };
  }

  readonly id!: number;
  name!: string;
  accessToken!: string;
  refreshToken!: string;
  expiresAt!: number;
}
