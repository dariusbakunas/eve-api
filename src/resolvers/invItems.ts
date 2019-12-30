import { InvGroupPartial, InvItemPartial, IResolverContext } from '../types';
import {
  InvItemMarketPriceArgs,
  ItemMarketPrice,
  Maybe,
  QueryInvItemsArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
} from '../__generated__/types';
import { raw } from 'objection';
import property from 'lodash.property';
import { MarketOrder } from '../services/db/models/marketOrder';

interface IResolvers<Context> {
  Query: {
    invItems: Resolver<Array<InvItemPartial>, ResolversParentTypes['Query'], Context, QueryInvItemsArgs>;
  };
  InvItem: {
    id: Resolver<ResolversTypes['ID'], InvItemPartial, Context>;
    name: Resolver<ResolversTypes['String'], InvItemPartial, Context>;
    invGroup: Resolver<InvGroupPartial, InvItemPartial, Context>;
    marketPrice: Resolver<Maybe<ResolversTypes['ItemMarketPrice']>, InvItemPartial, Context, RequireFields<InvItemMarketPriceArgs, 'systemId'>>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    invItems: async (_parent, { filter }, { dataSources }) => {
      const query = dataSources.db.InventoryItem.query()
        .select('invTypes.*', 'invGroup.groupName')
        .joinRelation('invGroup');

      if (filter) {
        if (filter.name) {
          query.where('typeName', 'like', `%${filter.name}%`);
        }

        if (filter.categoryIds) {
          query.where('invGroup.categoryID', 'in', filter.categoryIds);
        }
      }

      return query.where('invTypes.published', true).orderBy(['groupName', 'typeName']);
    },
  },
  InvItem: {
    id: property('typeID'),
    name: property('typeName'),
    invGroup: async (invItem, args, { dataSources: { loaders } }) => {
      if (invItem.groupName && invItem.categoryID) {
        return {
          groupID: invItem.groupID,
          groupName: invItem.groupName,
          categoryID: invItem.categoryID,
        };
      } else {
        const group = await loaders.invGroupLoader.load(invItem.groupID);

        if (group) {
          return group;
        }

        throw new Error(`Could not load invGroup ID: ${invItem.groupID}`);
      }
    },
    marketPrice: async (invItem, { systemId }, { dataSources: { db, loaders } }) => {
      const orders: Array<Partial<MarketOrder>> = await db.MarketOrder.query()
        .select('isBuy', raw('(case when isBuy = true then max(price) else min(price) end) as price'))
        .where('systemId', systemId)
        .where('typeId', invItem.typeID)
        .groupBy('isBuy');

      return orders.reduce<Partial<ItemMarketPrice>>((acc, order) => {
        if (order.isBuy) {
          acc.sell = order.price;
        } else {
          acc.buy = order.price;
        }

        return acc;
      }, {});
    },
  },
};

export default resolverMap;
