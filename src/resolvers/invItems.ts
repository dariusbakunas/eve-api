import { InvGroupPartial, InvItemPartial, IResolverContext } from '../types';
import {
  InvItemMarketPriceArgs,
  InvItemVolumeArgs,
  ItemMarketPrice,
  Maybe,
  QueryInvItemsArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
} from '../__generated__/types';
import { MarketPrice } from '../services/db/models/MarketPrice';
import property from 'lodash.property';

interface IResolvers<Context> {
  Query: {
    invItems: Resolver<Array<InvItemPartial>, ResolversParentTypes['Query'], Context, QueryInvItemsArgs>;
  };
  InvItem: {
    id: Resolver<ResolversTypes['ID'], InvItemPartial, Context>;
    name: Resolver<ResolversTypes['String'], InvItemPartial, Context>;
    invGroup: Resolver<InvGroupPartial, InvItemPartial, Context>;
    marketPrice: Resolver<Maybe<ResolversTypes['ItemMarketPrice']>, InvItemPartial, Context, RequireFields<InvItemMarketPriceArgs, 'systemId'>>;
    volume: Resolver<ResolversTypes['Float'], InvItemPartial, Context, RequireFields<InvItemVolumeArgs, 'packaged'>>;
  };
}

/**
 * These don't seem to be in data export
 */
const SHIP_PACKAGED_VOLUMES: { [key: number]: number } = {
  25: 2500,
  26: 10000,
  27: 50000,
  28: 10000,
  30: 13000000,
  31: 500,
  237: 2500,
  324: 2500,
  358: 10000,
  380: 10000,
  419: 15000,
  420: 5000,
  463: 3750,
  485: 1300000,
  513: 1300000,
  540: 15000,
  541: 5000,
  543: 3750,
  547: 1300000,
  659: 13000000,
  830: 2500,
  831: 2500,
  832: 10000,
  833: 10000,
  834: 2500,
  883: 1300000,
  893: 2500,
  894: 10000,
  898: 50000,
  900: 50000,
  902: 1300000,
  906: 10000,
  941: 500000,
  963: 10000,
  1022: 500,
  1201: 15000,
  1202: 10000,
  1283: 2500,
  1305: 5000,
};

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
    volume: async ({ groupID, volume }, { packaged }) => {
      return packaged && SHIP_PACKAGED_VOLUMES[groupID] ? SHIP_PACKAGED_VOLUMES[groupID] : volume!;
    },
  },
};

export default resolverMap;
