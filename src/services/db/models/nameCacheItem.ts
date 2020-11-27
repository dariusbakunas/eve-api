import { Model } from 'objection';

export class NameCacheItem extends Model {
  static tableName = 'nameCache';

  readonly id!: number;
  name!: string;
  category!: string;
}
