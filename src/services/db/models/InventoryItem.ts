import BaseModel from './base';

export class InventoryItem extends BaseModel {
  static tableName = 'invTypes';

  static get idColumn() {
    return 'typeID';
  }

  readonly typeID!: number;
  description?: string;
  typeName?: string;
}