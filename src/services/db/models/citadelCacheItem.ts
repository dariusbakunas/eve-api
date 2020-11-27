import { Model } from 'objection';

export class CitadelCacheItem extends Model {
  static tableName = 'citadelCache';

  readonly id!: number;
  name!: string;
  systemId!: number;
  typeId!: number;
  creatorId!: number;
  createdAt!: Date;
}
