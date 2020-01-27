import { InvItemPartial, IResolverContext, WarehouseItemPartial } from '../types';
import {
  Maybe,
  MutationAddItemsToWarehouseArgs,
  MutationAddWarehouseArgs,
  MutationRemoveItemsFromWarehouseArgs,
  MutationRemoveWarehouseArgs,
  MutationUpdateItemsInWarehouseArgs,
  MutationUpdateWarehouseArgs,
  QueryWarehouseArgs,
  QueryWarehouseItemsArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  Warehouse,
} from '../__generated__/types';
import { raw, transaction } from 'objection';
import { Warehouse as WarehouseDB } from '../services/db/models/warehouse';
import { WarehouseItem as WarehouseItemDB } from '../services/db/models/warehouseItem';
import property from 'lodash.property';

interface IResolvers<Context> {
  Query: {
    warehouse: Resolver<Maybe<ResolversTypes['Warehouse']>, ResolversParentTypes['Query'], Context, RequireFields<QueryWarehouseArgs, 'id'>>;
    warehouses: Resolver<Maybe<Array<WarehouseDB>>, ResolversParentTypes['Query'], Context>;
    warehouseItems: Resolver<
      Maybe<Array<WarehouseItemPartial>>,
      ResolversParentTypes['Query'],
      Context,
      RequireFields<QueryWarehouseItemsArgs, 'itemIds'>
    >;
  };
  Mutation: {
    addWarehouse: Resolver<ResolversTypes['Warehouse'], ResolversParentTypes['Mutation'], Context, RequireFields<MutationAddWarehouseArgs, 'name'>>;
    addItemsToWarehouse: Resolver<
      Array<WarehouseItemPartial>,
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationAddItemsToWarehouseArgs, 'id' | 'input'>
    >;
    updateItemsInWarehouse: Resolver<
      Array<WarehouseItemPartial>,
      ResolversParentTypes['Mutation'],
      Context,
      RequireFields<MutationUpdateItemsInWarehouseArgs, 'id' | 'input'>
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
    items: Resolver<Array<WarehouseItemPartial>, WarehouseDB, Context>;
    summary: Resolver<ResolversTypes['WarehouseSummary'], WarehouseDB, Context>;
  };
  WarehouseItem: {
    unitCost: Resolver<ResolversTypes['Float'], WarehouseItemPartial, Context>;
    item: Resolver<InvItemPartial, WarehouseItemPartial, Context>;
    warehouse: Resolver<ResolversTypes['Warehouse'], WarehouseItemPartial, Context>;
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
    warehouseItems: async (_parent, { itemIds, warehouseIds: warehouseIdFilter }, { dataSources, user: { id } }) => {
      const warehouseIds = warehouseIdFilter
        ? [...new Set(warehouseIdFilter)]
        : await dataSources.db.Warehouse.query()
            .select('id')
            .where('ownerId', id)
            .orderBy('name')
            .pluck('id');

      const items: Array<WarehouseItemPartial> = await dataSources.db.WarehouseItem.query()
        .where('warehouseId', 'in', warehouseIds)
        .where('warehouseItems.typeId', 'in', itemIds)
        .join('invTypes as item', 'item.typeID', 'warehouseItems.typeId')
        .orderBy('typeName');

      return items;
    },
  },
  Mutation: {
    addWarehouse: async (_, { name }, { dataSources: { db }, user: { id: userId } }) => {
      const user = await db.User.query().findById(userId);

      return user.$relatedQuery('warehouses').insert({
        name: name,
      });
    },
    updateItemsInWarehouse: async (_, { id, input }, { dataSources: { db } }) => {
      const knex = WarehouseItemDB.knex();
      const result: WarehouseItemPartial[] = [];

      return transaction(knex, async trx => {
        for (let i = 0; i < input.length; i++) {
          const item = input[i];

          const update: WarehouseItemPartial = {
            warehouseId: +id,
            typeId: +item.id,
            quantity: +item.quantity,
            unitPrice: +item.unitCost,
          };

          await db.WarehouseItem.query(trx)
            .patch(update)
            .where('typeId', item.id)
            .andWhere('warehouseId', id);

          result.push(update);
        }

        return result;
      });
    },
    addItemsToWarehouse: async (_, { id, input }, { dataSources: { db } }) => {
      const knex = WarehouseItemDB.knex();
      const newItemIds = input.map(item => item.id);

      const result: WarehouseItemPartial[] = [];

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

            const update: WarehouseItemPartial = {
              warehouseId: +id,
              typeId: +inputItem.id,
              quantity: newQuantity,
              unitPrice: newCost,
            };

            await db.WarehouseItem.query(trx)
              .patch(update)
              .where('typeId', inputItem.id)
              .andWhere('warehouseId', id);

            result.push(update);
          } else {
            const newItem: Partial<WarehouseItemDB> = {
              warehouseId: +id,
              typeId: +inputItem.id,
              quantity: inputItem.quantity,
              unitPrice: inputItem.unitCost,
            };

            const item: WarehouseItemDB = await db.WarehouseItem.query(trx).insertAndFetch(newItem);

            result.push(item);
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
    items: async ({ id }, args, { dataSources: { db } }): Promise<Array<WarehouseItemPartial>> => {
      return db.WarehouseItem.query()
        .where('warehouseId', id)
        .join('invTypes as item', 'item.typeID', 'warehouseItems.typeId')
        .orderBy('typeName');
    },
    summary: async ({ id }, args, { dataSources: { db } }) => {
      return db.WarehouseItem.query()
        .select(
          raw('sum(warehouseItems.unitPrice * warehouseItems.quantity) as totalCost'),
          raw('sum(warehouseItems.quantity * coalesce(sV.volume, invTypes.volume)) as totalVolume')
        )
        .join('invTypes', 'invTypes.typeID', 'warehouseItems.typeId')
        .leftJoin('shipVolumes as sV', 'sV.groupId', 'invTypes.groupID')
        .where('warehouseItems.warehouseId', id)
        .groupBy('warehouseItems.warehouseId')
        .first();
    },
  },
  WarehouseItem: {
    unitCost: property('unitPrice'),
    item: async ({ typeId }, args, { dataSources: { db, loaders } }) => {
      const item = await loaders.invItemLoader.load(typeId);

      if (!item) {
        throw new Error(`Unable to load item ID: ${typeId}`);
      }

      return item;
    },
    warehouse: async ({ warehouseId }, args, { dataSources: { loaders } }) => {
      const warehouse = await loaders.warehouseLoader.load(warehouseId);

      if (warehouse) {
        return {
          ...warehouse,
          id: `${warehouse.id}`,
        };
      } else {
        throw new Error(`Unable to load warehouse ID: ${warehouseId}`);
      }
    },
  },
};

export default resolverMap;
