import { Model } from 'objection';
import { Warehouse } from './warehouse';
import BaseModel from './base';

export class WarehouseItem extends BaseModel {
  static tableName = 'warehouseItems';

  static get idColumn() {
    return ['warehouseId', 'typeId'];
  }

  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: Warehouse,
      join: {
        from: 'warehouseItems.warehouseId',
        to: 'warehouses.id',
      },
    },
  };

  warehouseId!: number;
  readonly typeId!: number;
  unitPrice!: number;
  quantity!: number;
}
