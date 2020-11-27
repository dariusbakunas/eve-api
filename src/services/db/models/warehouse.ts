import { Model } from 'objection';
import { User } from './user';
import { WarehouseItem } from './warehouseItem';

export class Warehouse extends Model {
  static tableName = 'warehouses';

  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'warehouses.ownerId',
        to: 'users.id',
      },
    },
    items: {
      relation: Model.HasManyRelation,
      modelClass: WarehouseItem,
      join: {
        from: 'warehouses.id',
        to: 'warehouseItems.warehouseId',
      },
    },
  };

  readonly id!: number;
  ownerId!: number;
  name!: string;
}
