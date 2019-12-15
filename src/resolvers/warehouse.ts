import { InventoryItem } from '../services/db/models/InventoryItem';
import { IResolverContext } from '../types';
import {
  Maybe,
  MutationAddItemsToWarehouseArgs,
  MutationAddWarehouseArgs,
  MutationRemoveItemsFromWarehouseArgs,
  MutationRemoveWarehouseArgs,
  MutationUpdateWarehouseArgs,
  QueryWarehouseArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  Warehouse,
  WarehouseItem,
} from '../__generated__/types';
import { transaction } from 'objection';
import { UserInputError } from 'apollo-server-express';
import { Warehouse as WarehouseDB } from '../services/db/models/warehouse';
import { WarehouseItem as WarehouseItemDB } from '../services/db/models/warehouseItem';

interface ICombinedWarehouseItem extends WarehouseItemDB, InventoryItem {}

interface IResolvers<Context> {
  Query: {
    warehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ResolversParentTypes['Query'], Context, RequireFields<QueryWarehouseArgs, 'id'>>;
    warehouses: Resolver<Maybe<Array<WarehouseDB>>, ResolversParentTypes['Query'], Context>;
  };
  Mutation: {
    addWarehouse: Resolver<ResolversTypes['Warehouse'], ResolversParentTypes['Mutation'], Context, RequireFields<MutationAddWarehouseArgs, 'name'>>;
    addItemsToWarehouse: Resolver<
      Array<ResolversTypes['WarehouseItem']>,
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationAddItemsToWarehouseArgs, 'id' | 'input'>
    >;
    removeItemsFromWarehouse: Resolver<
      Array<ResolversTypes['ID']>,
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationRemoveItemsFromWarehouseArgs, 'id' | 'itemIds'>
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
    items: Resolver<Array<ResolversTypes['WarehouseItem']>, WarehouseDB, Context>;
  };
  WarehouseItem: {
    name: Resolver<ResolversTypes['String'], { id: string }, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    warehouse: async (_parent, { id }, { dataSources }): Promise<Maybe<Partial<Warehouse>>> => {
      const warehouse: WarehouseDB = await dataSources.db.Warehouse.query().findById(id);

      if (warehouse) {
        return {
          ...warehouse,
          id: `${warehouse.id}`,
        };
      } else {
        return null;
      }
    },
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
    addItemsToWarehouse: async (_, { id, input }, { dataSources: { db } }) => {
      const knex = WarehouseItemDB.knex();
      const newItemIds = input.map(item => item.id);

      const result: Partial<WarehouseItem>[] = [];

      return transaction(knex, async trx => {
        const existingItems: WarehouseItemDB[] = await db.WarehouseItem.query(trx)
          .whereIn('typeId', newItemIds)
          .andWhere('warehouseId', id);

        const existingItemMap = existingItems.reduce<{ [key: string]: WarehouseItemDB }>((acc, item) => {
          acc[item.typeId] = item;
          return acc;
        }, {});

        for (let i = 0; i < input.length; i++) {
          const inputItem = input[i];
          const existingItem = existingItemMap[inputItem.id];

          if (existingItem) {
            const newQuantity = existingItem.quantity + inputItem.quantity;
            const newCost = (existingItem.quantity * existingItem.unitPrice + inputItem.quantity * inputItem.unitCost) / newQuantity;

            const update: Partial<WarehouseItemDB> = {
              warehouseId: +id,
              typeId: +inputItem.id,
              quantity: newQuantity,
              unitPrice: newCost,
            };

            await db.WarehouseItem.query(trx)
              .patch(update)
              .where('typeId', inputItem.id)
              .andWhere('warehouseId', id);

            result.push({
              id: `${update.typeId}`,
              quantity: update.quantity,
              unitCost: update.unitPrice,
            });
          } else {
            const newItem: Partial<WarehouseItemDB> = {
              warehouseId: +id,
              typeId: +inputItem.id,
              quantity: inputItem.quantity,
              unitPrice: inputItem.unitCost,
            };

            const item: WarehouseItemDB = await db.WarehouseItem.query(trx).insertAndFetch(newItem);

            result.push({
              id: `${item.typeId}`,
              quantity: item.quantity,
              unitCost: item.unitPrice,
            });
          }
        }

        return result;
      });
    },
    removeItemsFromWarehouse: async (_, { id, itemIds }, { dataSources: { db } }) => {
      await db.WarehouseItem.query()
        .delete()
        .whereIn('typeId', itemIds)
        .andWhere('warehouseId', id);
      return itemIds;
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
