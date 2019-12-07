import { Model } from 'objection';
import { Warehouse } from './warehouse';
import BaseModel from './base';

export class WarehouseItem extends BaseModel {
  static tableName = 'warehouses';

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

  readonly id!: number;
  warehouseId!: number;
  typeId!: number;
  unitPrice!: number;
  quantity!: number;
}
