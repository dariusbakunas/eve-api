import { IResolverContext } from '../types';
import {
  Maybe,
  QueryWalletTransactionsArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
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
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    walletTransactions: async (_parent, { page }, { dataSources, user }) => {
      const { index, size } = page;
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const transactions = await dataSources.db.WalletTransaction.query()
          .where('characterId', 'in', characterIds)
          .page(index, size)
          .orderBy('date', 'desc');

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
  },
};

export default resolverMap;
