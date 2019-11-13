import BaseModel from './base';

export class CharacterNameCacheItem extends BaseModel {
  static tableName = 'characterNameCache';

  readonly id!: number;
  name!: string;
}
