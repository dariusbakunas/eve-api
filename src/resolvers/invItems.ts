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
import { MarketPrice } from '../services/db/models/MarketPrice';

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
      const item: Partial<MarketPrice> = await db.MarketPrice.query()
        .select('buyPrice', 'sellPrice')
        .where('systemId', systemId)
        .where('typeId', invItem.typeID)
        .first();

      if (item) {
        return {
          sell: item.sellPrice,
          buy: item.buyPrice,
        };
      }

      return null;
    },
  },
};

export default resolverMap;
