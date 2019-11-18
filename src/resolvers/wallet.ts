import { IResolverContext } from '../types';
import {
  Maybe,
  OrderType,
  QueryWalletTransactionsArgs,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  WalletTransactionOrderBy,
} from '../__generated__/types';
import { raw } from 'objection';
import { WalletTransaction } from '../services/db/models/walletTransaction';

interface IResolvers<Context> {
  Query: {
    walletTransactions: Resolver<Maybe<ResolversTypes['WalletTransactions']>, ResolversParentTypes['Query'], Context, QueryWalletTransactionsArgs>;
  };
  WalletTransaction: {
    item: Resolver<Maybe<ResolversTypes['InventoryItem']>, WalletTransaction, Context>;
    character: Resolver<Maybe<ResolversTypes['Character']>, WalletTransaction, Context>;
    client: Resolver<ResolversTypes['Client'], WalletTransaction, Context>;
    location: Resolver<Maybe<ResolversTypes['Location']>, WalletTransaction, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    walletTransactions: async (_parent, { filter, page, orderBy }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };

      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.WalletTransaction.query()
          .select(
            'walletTransactions.*',
            raw('coalesce(citadel.name, station.stationName) as locationName'),
            raw('(walletTransactions.quantity * walletTransactions.unitPrice) * if(walletTransactions.isBuy, -1, 1) as credit')
          )
          .leftJoin('citadelCache as citadel', 'citadel.id', 'walletTransactions.locationId')
          .leftJoin('staStations as station', 'station.stationID', 'walletTransactions.locationId')
          .join('invTypes as item', 'item.typeID', 'walletTransactions.typeId');

        if (filter) {
          if (filter.orderType) {
            if (filter.orderType === OrderType.Buy) {
              query.where('walletTransactions.isBuy', 1);
            } else {
              query.where('walletTransactions.isBuy', 0);
            }
          }

          if (filter.item) {
            query.where('item.typeName', 'like', `%${filter.item}%`);
          }
        }

        if (orderBy) {
          let orderByCol;
          const { column, order } = orderBy;
          switch (column) {
            case WalletTransactionOrderBy.UnitPrice:
              orderByCol = 'unitPrice';
              break;
            case WalletTransactionOrderBy.Credit:
              orderByCol = 'credit';
              break;
            case WalletTransactionOrderBy.Date:
              orderByCol = 'date';
              break;
            case WalletTransactionOrderBy.Quantity:
              orderByCol = 'quantity';
              break;
            case WalletTransactionOrderBy.Character:
              query.join('characters as character', 'character.id', 'walletTransactions.characterId');
              orderByCol = 'character.name';
              break;
            case WalletTransactionOrderBy.Item:
              orderByCol = 'item.typeName';
              break;
            case WalletTransactionOrderBy.Client:
              query.join('nameCache as client', 'client.id', 'walletTransactions.clientId');
              orderByCol = 'client.name';
              break;
            case WalletTransactionOrderBy.Station:
              orderByCol = 'locationName';
              break;
          }

          if (orderByCol) {
            query.orderBy(orderByCol, order);
          }
        }

        const transactions = await query.where('characterId', 'in', characterIds).page(index, size);

        return {
          total: transactions.total,
          transactions: transactions.results,
        };
      }

      return {
        total: 0,
        transactions: [],
      };
    },
  },
  WalletTransaction: {
    character: async (parent, args, { dataSources }) => {
      const { loaders } = dataSources;
      const character = await loaders.characterLoader.load(parent.characterId);

      if (character != null) {
        return ({
          ...character,
          id: `${character.id}`,
        } as unknown) as ResolversTypes['Character']; // TODO: no idea why it would not like it??
      }

      return null;
    },
    client: async (parent, args, { dataSources }) => {
      const { db } = dataSources;
      const nameCache = await db.NameCacheItem.query().findById(parent.clientId);
      const client = { id: `${parent.clientId}`, name: 'Unknown', category: 'unknown' };

      if (nameCache) {
        client.name = nameCache.name;
        client.category = nameCache.category;
      }

      // TODO: add loader to load names in case it is not yet in cache
      return client;
    },
    item: async (parent, args, { dataSources }) => {
      // TODO: since we do join anyway reuse that from parent
      const { loaders } = dataSources;
      const item = await loaders.invItemLoader.load(parent.typeId);

      if (item) {
        return {
          ...item,
          id: `${item.typeID}`,
          name: item.typeName,
        };
      }

      return null;
    },
    location: parent => {
      return {
        id: `${parent.locationId}`,
        name: parent.locationName || 'Unknown Station',
      };
    },
  },
};

export default resolverMap;
