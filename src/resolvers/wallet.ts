import { Character } from '../services/db/models/character';
import { getCharacter } from './common';
import {
  InventoryItem,
  MarketOrderOrderBy,
  Maybe,
  OrderType,
  QueryMarketOrdersArgs,
  QueryWalletJournalArgs,
  QueryWalletTransactionIdsArgs,
  QueryWalletTransactionsArgs,
  QueryWalletTransactionSummaryArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  WalletJournalOrderBy,
  WalletTransactionOrderBy,
} from '../__generated__/types';
import { IResolverContext } from '../types';
import { JoinClause } from 'knex';
import { JournalEntry } from '../services/db/models/journalEntry';
import { Loaders } from '../services/db/loaders';
import { MarketOrder } from '../services/db/models/marketOrder';
import { QueryBuilder, raw } from 'objection';
import { UserInputError } from 'apollo-server-express';
import { WalletTransaction } from '../services/db/models/walletTransaction';

interface IResolvers<Context> {
  Query: {
    marketOrders: Resolver<Maybe<ResolversTypes['MarketOrders']>, ResolversParentTypes['Query'], Context, QueryMarketOrdersArgs>;
    walletJournal: Resolver<Maybe<ResolversTypes['JournalEntries']>, ResolversParentTypes['Query'], Context, QueryWalletJournalArgs>;
    walletTransactions: Resolver<Maybe<ResolversTypes['WalletTransactions']>, ResolversParentTypes['Query'], Context, QueryWalletTransactionsArgs>;
    walletTransactionIds: Resolver<Array<ResolversTypes['ID']>, ResolversParentTypes['Query'], Context, QueryWalletTransactionIdsArgs>;
    walletTransactionSummary: Resolver<
      ResolversTypes['WalletTransactionSummary'],
      ResolversParentTypes['Query'],
      Context,
      RequireFields<QueryWalletTransactionSummaryArgs, 'ids'>
    >;
  };
  MarketOrder: {
    item: Resolver<ResolversTypes['InventoryItem'], MarketOrder, Context>;
    character: Resolver<Character, MarketOrder, Context>;
    location: Resolver<Maybe<ResolversTypes['Location']>, MarketOrder, Context>;
  };
  WalletTransaction: {
    item: Resolver<ResolversTypes['InventoryItem'], WalletTransaction, Context>;
    character: Resolver<Character, WalletTransaction, Context>;
    client: Resolver<ResolversTypes['Client'], WalletTransaction, Context>;
    location: Resolver<Maybe<ResolversTypes['Location']>, WalletTransaction, Context>;
  };
  WalletTransactions: {
    lastUpdate: Resolver<Maybe<ResolversTypes['DateTime']>, Resolver<Maybe<ResolversTypes['WalletTransactions']>>, Context>;
  };
  JournalEntry: {
    character: Resolver<Character, JournalEntry, Context>;
  };
}

const getItem: (typeId: number, loaders: Loaders) => Promise<InventoryItem> = async (typeId, loaders) => {
  const item = await loaders.invItemLoader.load(typeId);

  if (!item) {
    throw new Error(`Item id: ${typeId} not found`);
  }

  return {
    ...item,
    id: `${item.typeID}`,
    name: item.typeName,
  };
};

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    marketOrders: async (_parent, { filter, orderBy, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.MarketOrder.query()
          .select('marketOrders.*', raw('coalesce(citadel.name, station.stationName) as locationName'))
          .leftJoin('citadelCache as citadel', 'citadel.id', 'marketOrders.locationId')
          .leftJoin('staStations as station', 'station.stationID', 'marketOrders.locationId');

        if (filter && filter.characterId) {
          if (characterIds.includes(+filter.characterId)) {
            query.where('marketOrders.characterId', filter.characterId);
          } else {
            throw new UserInputError('Invalid character id');
          }
        } else {
          query.where('marketOrders.characterId', 'in', characterIds);
        }

        if (filter && filter.state) {
          query.where((builder: QueryBuilder<MarketOrder>) => {
            if (filter.state!.active) {
              builder.orWhere('state', 'active');
            }

            if (filter.state!.expired) {
              builder.orWhere('state', 'expired');
            }

            if (filter.state!.cancelled) {
              builder.orWhere('state', 'cancelled');
            }
          });
        }

        if (orderBy) {
          let orderByCol;
          const { column, order } = orderBy;

          switch (column) {
            case MarketOrderOrderBy.Issued:
              orderByCol = column;
              break;
          }

          if (orderByCol) {
            query.orderBy(orderByCol, order);
          }
        }

        const orders = await query.page(index, size);

        return {
          total: orders.total,
          orders: orders.results,
        };
      }

      return {
        total: 0,
        entries: [],
      };
    },
    walletJournal: async (_parent, { filter, orderBy, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };

      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.JournalEntry.query().select('journalEntries.*');

        if (filter && filter.characterId) {
          if (characterIds.includes(+filter.characterId)) {
            query.where('journalEntries.characterId', filter.characterId);
          } else {
            throw new UserInputError('Invalid character id');
          }
        } else {
          query.where('journalEntries.characterId', 'in', characterIds);
        }

        if (orderBy) {
          let orderByCol;
          const { column, order } = orderBy;

          switch (column) {
            case WalletJournalOrderBy.Date:
            case WalletJournalOrderBy.Amount:
            case WalletJournalOrderBy.Balance:
            case WalletJournalOrderBy.Description:
              orderByCol = column;
              break;
            case WalletJournalOrderBy.Character:
              query.join('characters as character', 'character.id', 'journalEntries.characterId');
              orderByCol = 'character.name';
              break;
          }

          if (orderByCol) {
            query.orderBy(orderByCol, order);
          }
        }

        const entries = await query.page(index, size);

        return {
          total: entries.total,
          entries: entries.results,
        };
      }

      return {
        total: 0,
        entries: [],
      };
    },
    walletTransactionIds: async (_parent, { filter }, { dataSources, user }) => {
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.WalletTransaction.query()
          .select('walletTransactions.id')
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

          if (filter.characterId) {
            if (characterIds.includes(+filter.characterId)) {
              query.where('walletTransactions.characterId', filter.characterId);
            } else {
              throw new UserInputError('Invalid character id');
            }
          } else {
            query.where('walletTransactions.characterId', 'in', characterIds);
          }
        }

        return query.pluck('id');
      }

      return [];
    },
    walletTransactionSummary: async (_parent, { ids }, { dataSources, user }) => {
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      const transactions = dataSources.db.WalletTransaction.query()
        .select(
          'walletTransactions.id',
          'item.typeID',
          'item.typeName',
          'walletTransactions.isBuy',
          raw('(walletTransactions.quantity * walletTransactions.unitPrice) * if(walletTransactions.isBuy, -1, 1) as credit')
        )
        .join('invTypes as item', 'item.typeID', 'walletTransactions.typeId')
        .whereIn('walletTransactions.id', ids)
        .whereIn('walletTransactions.characterId', characterIds)
        .as('transactions');

      const result: Array<{ id: string; name: string; quantity: number; credit: number }> = await dataSources.db.WalletTransaction.query()
        .select('transactions.typeID as id', 'transactions.typeName as name')
        .sum('walletTransactions.quantity as quantity')
        .sum('transactions.credit as credit')
        .innerJoin(transactions, function(this: JoinClause) {
          this.on('transactions.id', 'walletTransactions.id');
        })
        .groupBy('transactions.typeID', 'transactions.typeName', 'walletTransactions.isBuy')
        .orderBy('transactions.typeName');

      return {
        items: result,
      };
    },
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
          if (filter.ids) {
            query.whereIn('walletTransactions.id', filter.ids);
          }

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

          if (filter.characterId) {
            if (characterIds.includes(+filter.characterId)) {
              query.where('walletTransactions.characterId', filter.characterId);
            } else {
              throw new UserInputError('Invalid character id');
            }
          } else {
            query.where('walletTransactions.characterId', 'in', characterIds);
          }
        }

        if (orderBy) {
          let orderByCol;
          const { column, order } = orderBy;
          switch (column) {
            case WalletTransactionOrderBy.Quantity:
            case WalletTransactionOrderBy.Date:
            case WalletTransactionOrderBy.Credit:
            case WalletTransactionOrderBy.UnitPrice:
              orderByCol = column;
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

        const transactions = await query.page(index, size);

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
  JournalEntry: {
    character: async (parent, args, { dataSources }) => {
      return getCharacter(parent.characterId, dataSources.loaders);
    },
  },
  MarketOrder: {
    character: async (parent, args, { dataSources }) => {
      return getCharacter(parent.characterId, dataSources.loaders);
    },
    item: async (parent, args, { dataSources }) => {
      return getItem(parent.typeId, dataSources.loaders);
    },
    location: parent => {
      return {
        id: `${parent.locationId}`,
        name: parent.locationName || 'Unknown Station',
      };
    },
  },
  WalletTransaction: {
    character: async (parent, args, { dataSources }) => {
      return getCharacter(parent.characterId, dataSources.loaders);
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
      return getItem(parent.typeId, dataSources.loaders);
    },
    location: parent => {
      return {
        id: `${parent.locationId}`,
        name: parent.locationName || 'Unknown Station',
      };
    },
  },
  WalletTransactions: {
    lastUpdate: async (parent, args, { dataSources, user: { id } }) => {
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', id)
        .pluck('id');

      if (characterIds.length) {
        const lastUpdate = await dataSources.db.JobLogEntry.query()
          .where('category', 'WALLET_TRANSACTIONS')
          .where('status', 'SUCCESS')
          .orderBy('createdAt', 'desc')
          .first();

        return lastUpdate.createdAt;
      }

      return null;
    },
  },
};

export default resolverMap;
