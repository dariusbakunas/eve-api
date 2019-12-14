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
      ResolversTypes['WarehouseItem'],
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationAddItemsToWarehouseArgs, 'id' | 'input'>
    >;
    removeItemsFromWarehouse: Resolver<
      Maybe<ResolversTypes['WarehouseItem']>,
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationRemoveItemsFromWarehouseArgs, 'id' | 'itemId' | 'quantity'>
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
            quantity: newQuantity,
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
    removeItemsFromWarehouse: async (_, { id, itemId, quantity }, { dataSources: { db } }) => {
      const knex = WarehouseItemDB.knex();

      return transaction(knex, async trx => {
        const existingItem: WarehouseItemDB = await db.WarehouseItem.query(trx)
          .where('typeId', itemId)
          .andWhere('warehouseId', id)
          .first();

        if (!existingItem || existingItem.quantity < quantity) {
          throw new UserInputError('Insufficient quantity remaining');
        }

        const remainingQuantity = existingItem.quantity - quantity;

        if (remainingQuantity > 0) {
          const update: Partial<WarehouseItemDB> = {
            warehouseId: +id,
            typeId: +itemId,
            quantity: existingItem.quantity - quantity,
          };

          await db.WarehouseItem.query(trx)
            .patch(update)
            .where('typeId', itemId)
            .andWhere('warehouseId', id);

          return {
            id: `${update.typeId}`,
            quantity: update.quantity,
            unitCost: existingItem.unitPrice,
          };
        } else {
          await db.WarehouseItem.query(trx)
            .delete()
            .where('typeId', itemId)
            .andWhere('warehouseId', id);

          return null;
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
