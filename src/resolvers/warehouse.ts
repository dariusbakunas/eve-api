import { InventoryItem } from '../services/db/models/InventoryItem';
import { IResolverContext } from '../types';
import {
  Maybe,
  MutationAddWarehouseArgs,
  MutationAddWarehouseItemArgs,
  MutationRemoveWarehouseArgs,
  MutationUpdateWarehouseArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  WarehouseItem,
} from '../__generated__/types';
import { transaction } from 'objection';
import { Warehouse } from '../services/db/models/warehouse';
import { WarehouseItem as WarehouseItemDB } from '../services/db/models/warehouseItem';

interface ICombinedWarehouseItem extends WarehouseItemDB, InventoryItem {}

interface IResolvers<Context> {
  Query: {
    warehouses: Resolver<Maybe<Array<Warehouse>>, ResolversParentTypes['Query'], Context>;
  };
  Mutation: {
    addWarehouse: Resolver<ResolversTypes['Warehouse'], ResolversParentTypes['Mutation'], Context, RequireFields<MutationAddWarehouseArgs, 'name'>>;
    addWarehouseItem: Resolver<
      ResolversTypes['WarehouseItem'],
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationAddWarehouseItemArgs, 'id' | 'input'>
    >;
    removeWarehouse: Resolver<ResolversTypes['ID'], ResolversParentTypes['Mutation'], Context, RequireFields<MutationRemoveWarehouseArgs, 'id'>>;
    updateWarehouse?: Resolver<
      ResolversTypes['Warehouse'],
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationUpdateWarehouseArgs, 'id' | 'name'>
    >;
  };
  Warehouse: {
    items: Resolver<Array<ResolversTypes['WarehouseItem']>, Warehouse, Context>;
  };
  WarehouseItem: {
    name: Resolver<ResolversTypes['String'], { id: string }, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    warehouses: async (_parent, args, { dataSources, user: { id } }) => {
      return dataSources.db.Warehouse.query()
        .where('ownerId', id)
        .orderBy('name');
    },
  },
  Mutation: {
    addWarehouse: async (_, { name }, { dataSources: { db }, user: { id: userId } }) => {
      const user = await db.User.query().findById(userId);

      return user.$relatedQuery('warehouses').insert({
        name: name,
      });
    },
    addWarehouseItem: async (_, { id, input }, { dataSources: { db }, user: { id: userId } }) => {
      const knex = WarehouseItemDB.knex();

      return transaction(knex, async trx => {
        const existingItem: WarehouseItemDB = await db.WarehouseItem.query(trx)
          .where('typeId', input.id)
          .andWhere('warehouseId', id)
          .first();

        if (existingItem) {
          // update
          const newQuantity = existingItem.quantity + input.quantity;
          const newCost = (existingItem.quantity * existingItem.unitPrice + input.quantity * input.unitCost) / newQuantity;

          const update: Partial<WarehouseItemDB> = {
            warehouseId: +id,
            typeId: +input.id,
            quantity: existingItem.quantity + input.quantity,
            unitPrice: newCost,
          };

          await db.WarehouseItem.query(trx)
            .patch(update)
            .where('typeId', input.id)
            .andWhere('warehouseId', id);

          return {
            id: `${update.typeId}`,
            quantity: update.quantity,
            unitCost: update.unitPrice,
          };
        } else {
          const newItem: Partial<WarehouseItemDB> = {
            warehouseId: +id,
            typeId: +input.id,
            quantity: input.quantity,
            unitPrice: input.unitCost,
          };

          const item: WarehouseItemDB = await db.WarehouseItem.query(trx).insertAndFetch(newItem);

          return {
            id: `${item.typeId}`,
            quantity: item.quantity,
            unitCost: item.unitPrice,
          };
        }
      });
    },
    removeWarehouse: async (_, { id }, { dataSources: { db } }) => {
      await db.Warehouse.query().deleteById(id);
      return id;
    },
    updateWarehouse: async (_, { id, name }, { dataSources: { db } }) => {
      const warehouse = await db.Warehouse.query().findById(id);
      return warehouse.$query().updateAndFetch({
        name: name,
      });
    },
  },
  Warehouse: {
    items: async ({ id }, args, { dataSources: { db } }): Promise<Array<Partial<WarehouseItem>>> => {
      const items: Array<ICombinedWarehouseItem> = await db.WarehouseItem.query().where('warehouseId', id);

      return items.map(item => ({
        id: `${item.typeId}`,
        quantity: item.quantity,
        unitCost: item.unitPrice,
      }));
    },
  },
  WarehouseItem: {
    name: async ({ id }, args, { dataSources: { loaders } }): Promise<string> => {
      const invItem = await loaders.invItemLoader.load(+id);
      return invItem!.typeName!; // unlikely for it to not exist or not have name
    },
  },
};

export default resolverMap;
