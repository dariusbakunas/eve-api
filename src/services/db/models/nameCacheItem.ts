import BaseModel from './base';

export class NameCacheItem extends BaseModel {
  static tableName = 'nameCache';

  readonly id!: number;
  name!: string;
  category!: string;
}
