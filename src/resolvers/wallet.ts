import { IResolverContext } from '../types';
import {
  Maybe,
  QueryWalletTransactionsArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  WalletTransactionOrderBy,
} from '../__generated__/types';
import { WalletTransaction } from '../services/db/models/walletTransaction';

interface IResolvers<Context> {
  Query: {
    walletTransactions: Resolver<
      Maybe<ResolversTypes['WalletTransactions']>,
      ResolversParentTypes['Query'],
      Context,
      RequireFields<QueryWalletTransactionsArgs, 'page'>
    >;
  };
  WalletTransaction: {
    item: Resolver<Maybe<ResolversTypes['InventoryItem']>, WalletTransaction, Context>;
    character: Resolver<Maybe<ResolversTypes['Character']>, WalletTransaction, Context>;
    client: Resolver<ResolversTypes['Client'], WalletTransaction, Context>;
    credit: Resolver<ResolversTypes['Float'], WalletTransaction, Context>;
    location: Resolver<Maybe<ResolversTypes['Location']>, WalletTransaction, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    walletTransactions: async (_parent, { page, orderBy }, { dataSources, user }) => {
      const { index, size } = page;

      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.WalletTransaction.query();

        if (orderBy) {
          let orderByCol;
          const { column, order } = orderBy;
          switch (column) {
            case WalletTransactionOrderBy.UnitPrice:
              orderByCol = 'unitPrice';
              break;
            case WalletTransactionOrderBy.Date:
              orderByCol = 'date';
              break;
            case WalletTransactionOrderBy.Quantity:
              orderByCol = 'quantity';
              break;
            case WalletTransactionOrderBy.Character:
              query.join(
                'characters as character',
                'character.id',
                'walletTransactions.characterId'
              );
              orderByCol = 'character.name';
              break;
            case WalletTransactionOrderBy.Item:
              query.join('invTypes as item', 'item.typeID', 'walletTransactions.typeId');
              orderByCol = 'item.typeName';
              break;
            case WalletTransactionOrderBy.Client:
              query.join('nameCache', 'nameCache.id', 'walletTransactions.clientId');
              orderByCol = 'nameCache.name';
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
    credit: parent => {
      return parent.unitPrice * parent.quantity * (parent.isBuy ? -1 : 1);
    },
    item: async (parent, args, { dataSources }) => {
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
    location: async (parent, args, { dataSources }) => {
      const { loaders } = dataSources;
      if (parent.locationId.toString().length === 8) {
        // all staStation ids have 8 digits, otherwise it is a citadel
        const station = await loaders.stationLoader.load(parent.locationId);

        if (station) {
          return {
            id: `${station.stationID}`,
            name: station.stationName,
          };
        }
      }

      // TODO: add api call for citadels
      return {
        id: `${parent.locationId}`,
        name: 'Unknown Citadel',
      };
    },
  },
};

export default resolverMap;