import { Character } from '../services/db/models/character';
import { CharacterMarketOrder } from '../services/db/models/characterMarketOrder';
import {
  CharacterMarketOrderOrderBy,
  MarketGroup,
  Maybe,
  OrderType,
  QueryCharacterMarketOrdersArgs,
  QueryWalletJournalArgs,
  QueryWalletTransactionIdsArgs,
  QueryWalletTransactionsArgs,
  QueryWalletTransactionSummaryArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  WalletJournalOrderBy,
  WalletTransactionFilter,
  WalletTransactionOrderBy,
} from '../__generated__/types';
import { getCharacter } from './common';
import { InventoryItem } from '../services/db/models/InventoryItem';
import { InvItemPartial, IResolverContext } from '../types';
import { JoinClause } from 'knex';
import { JournalEntry } from '../services/db/models/journalEntry';
import { Loaders } from '../services/db/loaders';
import { QueryBuilder, raw } from 'objection';
import { UserInputError } from 'apollo-server-express';
import { WalletTransaction as WalletTransactionDB } from '../services/db/models/walletTransaction';

interface IResolvers<Context> {
  Query: {
    characterMarketOrders: Resolver<
      Maybe<{
        total: number;
        orders: Array<CharacterMarketOrder>;
      }>,
      ResolversParentTypes['Query'],
      Context,
      QueryCharacterMarketOrdersArgs
    >;
    walletJournal: Resolver<
      Maybe<{
        total: number;
        entries: Array<JournalEntry>;
      }>,
      ResolversParentTypes['Query'],
      Context,
      QueryWalletJournalArgs
    >;
    walletTransactions: Resolver<
      Maybe<{
        total: number;
        transactions: Array<WalletTransactionDB>;
      }>,
      ResolversParentTypes['Query'],
      Context,
      QueryWalletTransactionsArgs
    >;
    walletTransactionIds: Resolver<Array<number>, ResolversParentTypes['Query'], Context, QueryWalletTransactionIdsArgs>;
    walletTransactionSummary: Resolver<
      ResolversTypes['WalletTransactionSummary'],
      ResolversParentTypes['Query'],
      Context,
      RequireFields<QueryWalletTransactionSummaryArgs, 'ids'>
    >;
  };
  CharacterMarketOrder: {
    item: Resolver<InvItemPartial, CharacterMarketOrder, Context>;
    character: Resolver<Character, CharacterMarketOrder, Context>;
    location: Resolver<Maybe<ResolversTypes['Location']>, CharacterMarketOrder, Context>;
  };
  WalletTransaction: {
    item: Resolver<InvItemPartial, WalletTransactionDB, Context>;
    marketGroup: Resolver<Maybe<ResolversTypes['MarketGroup']>, WalletTransactionDB, Context>;
    character: Resolver<Character, WalletTransactionDB, Context>;
    client: Resolver<ResolversTypes['Client'], WalletTransactionDB, Context>;
    location: Resolver<Maybe<ResolversTypes['Location']>, WalletTransactionDB, Context>;
  };
  WalletTransactions: {
    lastUpdate: Resolver<Maybe<ResolversTypes['DateTime']>, Resolver<Maybe<ResolversTypes['WalletTransactions']>>, Context>;
  };
  JournalEntry: {
    character: Resolver<Character, JournalEntry, Context>;
  };
}

const applyTransactionFilter = (query: any, characterIds: number[], filter?: WalletTransactionFilter | null) => {
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

    if (filter.characterIds && filter.characterIds.length) {
      const validIds = new Set(characterIds);

      if (filter.characterIds.every((id) => validIds.has(+id))) {
        query.where('walletTransactions.characterId', 'in', filter.characterIds);
      } else {
        throw new UserInputError('Invalid character id');
      }
    } else {
      query.where('walletTransactions.characterId', 'in', characterIds);
    }
  } else {
    query.where('walletTransactions.characterId', 'in', characterIds);
  }
};

const getItem: (typeId: number, loaders: Loaders) => Promise<InvItemPartial> = async (typeId, loaders) => {
  const item: Maybe<InventoryItem> = await loaders.invItemLoader.load(typeId);

  if (!item) {
    throw new Error(`Item id: ${typeId} not found`);
  }

  return item;
};

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    characterMarketOrders: async (_parent, { filter, orderBy, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .then((characters) => characters.map((character) => character.id));

      if (characterIds.length) {
        const query = dataSources.db.CharacterMarketOrder.query()
          .select('characterMarketOrders.*', raw('coalesce(citadel.name, station.stationName) as locationName'))
          .leftJoin('citadelCache as citadel', 'citadel.id', 'characterMarketOrders.locationId')
          .leftJoin('staStations as station', 'station.stationID', 'characterMarketOrders.locationId');

        if (filter && filter.characterId) {
          if (characterIds.includes(+filter.characterId)) {
            query.where('characterMarketOrders.characterId', filter.characterId);
          } else {
            throw new UserInputError('Invalid character id');
          }
        } else {
          query.where('characterMarketOrders.characterId', 'in', characterIds);
        }

        if (filter && filter.state) {
          query.where((builder: QueryBuilder<CharacterMarketOrder>) => {
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
            case CharacterMarketOrderOrderBy.Issued:
              orderByCol = column;
              break;
          }

          if (orderByCol) {
            query.orderBy(orderByCol, order);
          }
        }

        const orders = await query.page(index || 0, size || 10);

        return {
          total: orders.total,
          orders: orders.results,
        };
      }

      return {
        total: 0,
        orders: [],
      };
    },
    walletJournal: async (_parent, { filter, orderBy, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };

      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .then((characters) => characters.map((character) => character.id));

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

        const entries = await query.page(index || 0, size || 0);

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
        .then((characters) => characters.map((character) => character.id));

      if (characterIds.length) {
        const query = dataSources.db.WalletTransaction.query()
          .select('walletTransactions.id')
          .join('invTypes as item', 'item.typeID', 'walletTransactions.typeId');

        applyTransactionFilter(query, characterIds, filter);

        return query.then((transactions) => transactions.map((transaction) => transaction.id));
      }

      return [];
    },
    walletTransactionSummary: async (_parent, { ids }, { dataSources, user }) => {
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .then((characters) => characters.map((character) => character.id));

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

      const result = ((await dataSources.db.WalletTransaction.query()
        .select('transactions.typeID as id', 'transactions.typeName as name')
        .sum('walletTransactions.quantity as quantity')
        .sum('transactions.credit as credit')
        .innerJoin(transactions, function (this: JoinClause) {
          this.on('transactions.id', 'walletTransactions.id');
        })
        .groupBy('transactions.typeID', 'transactions.typeName', 'walletTransactions.isBuy')
        .orderBy('transactions.typeName')) as unknown) as Array<{ id: string; name: string; quantity: number; credit: number }>;

      return {
        items: result,
      };
    },
    walletTransactions: async (_parent, { filter, page, orderBy }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };

      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .then((characters) => characters.map((character) => character.id));

      if (characterIds.length) {
        const query = dataSources.db.WalletTransaction.query()
          .select(
            'walletTransactions.*',
            'item.groupID',
            'item.typeName',
            'item.marketGroupID',
            'invGroup.groupName',
            'invGroup.categoryID',
            raw('coalesce(citadel.name, station.stationName) as locationName'),
            raw('(walletTransactions.quantity * walletTransactions.unitPrice) * if(walletTransactions.isBuy, -1, 1) as credit')
          )
          .leftJoin('citadelCache as citadel', 'citadel.id', 'walletTransactions.locationId')
          .leftJoin('staStations as station', 'station.stationID', 'walletTransactions.locationId')
          .join('invTypes as item', 'item.typeID', 'walletTransactions.typeId')
          .join('invGroups as invGroup', 'item.groupID', 'invGroup.groupID');

        applyTransactionFilter(query, characterIds, filter);

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
            case WalletTransactionOrderBy.InvGroup:
              orderByCol = 'invGroup.groupName';
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

        const transactions = await query.page(index || 0, size || 10);

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
  CharacterMarketOrder: {
    character: async (parent, args, { dataSources }) => {
      return getCharacter(parent.characterId, dataSources.loaders);
    },
    item: async (parent, args, { dataSources }) => {
      return getItem(parent.typeId, dataSources.loaders);
    },
    location: (parent) => {
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
      return {
        typeID: parent.typeId,
        typeName: parent.typeName,
        groupID: parent.groupID,
        groupName: parent.groupName,
      };
    },
    location: (parent) => {
      return {
        id: `${parent.locationId}`,
        name: parent.locationName || 'Unknown Station',
      };
    },
    marketGroup: async (parent, args, { dataSources: { loaders } }) => {
      if (parent.marketGroupID) {
        const group = await loaders.marketGroupLoader.load(parent.marketGroupID);

        if (group) {
          const result: MarketGroup = {
            id: `${group.marketGroupID}`,
            name: group.marketGroupName,
          };

          return result;
        }
      }

      return null;
    },
  },
  WalletTransactions: {
    lastUpdate: async (parent, args, { dataSources, user: { id } }) => {
      const characterIds = await dataSources.db.Character.query().select('id').where('ownerId', id).pluck('id');

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
