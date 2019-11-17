import BaseModel from './base';

export class CitadelCacheItem extends BaseModel {
  static tableName = 'citadelCache';

  readonly id!: number;
  name!: string;
  systemId!: number;
  typeId!: number;
  creatorId!: number;
  createdAt!: Date;
}
