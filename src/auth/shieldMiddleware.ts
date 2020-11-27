import { and, rule, shield } from 'graphql-shield';
import { ApolloContext } from '../types';
import { IDataSources } from '../services';
import { MutationRegisterArgs } from '../__generated__/types';

const allow = rule()(() => true);
const deny = rule()(() => false);

const isCharacterOwner = rule()(async (parent, { id }, { user, dataSources }: ApolloContext & { dataSources: IDataSources }) => {
  const result = await dataSources.db.Character.query().where('id', '=', id).andWhere('ownerId', '=', user!.id).count('*').pluck('count(*)').first();

  const count = (result as unknown) as number;
  return count === 1;
});

const isWarehouseOwner = rule()(async (parent, { id }, { user, dataSources }: ApolloContext & { dataSources: IDataSources }) => {
  const result = await dataSources.db.Warehouse.query().where('id', '=', id).andWhere('ownerId', '=', user!.id).count('*').pluck('count(*)').first();

  const count = (result as unknown) as number;
  return count === 1;
});

const isMultipleWarehouseOwner = rule()(
  async (parent, { warehouseIds }: { warehouseIds: number[] }, { user, dataSources }: ApolloContext & { dataSources: IDataSources }) => {
    if (!warehouseIds) {
      return true;
    }

    const idSet = new Set(warehouseIds);

    const result = await dataSources.db.Warehouse.query()
      .where('id', 'in', [...idSet])
      .andWhere('ownerId', '=', user!.id)
      .count('*')
      .pluck('count(*)')
      .first();
    const count = (result as unknown) as number;
    return count === idSet.size;
  }
);

const isActiveUser = rule({ cache: 'contextual' })((parent, args, { user }: ApolloContext) => !!user && user.status === 'ACTIVE');

// current user email should match the one requested
const hasSameEmail = rule()((parent, args, { user }: ApolloContext) => !!user && user.email === args.email);

const canRegister = rule()((parent, args: MutationRegisterArgs, { user }: ApolloContext) => !!user && user.email === args.input.email);

const isGuest = rule()((parent, args, { user }: ApolloContext) => !!user && user.status === 'GUEST');

const shieldMiddleware = shield(
  {
    Query: {
      '*': deny,
      buildInfo: isActiveUser,
      blueprints: isActiveUser,
      character: and(isActiveUser, isCharacterOwner),
      characters: isActiveUser,
      industryJobs: isActiveUser,
      scopes: isActiveUser,
      userByEmail: hasSameEmail,
      invItems: isActiveUser,
      characterMarketOrders: isActiveUser,
      processingLogs: isActiveUser,
      walletJournal: isActiveUser,
      walletTransactions: isActiveUser,
      walletTransactionIds: isActiveUser,
      walletTransactionSummary: isActiveUser,
      warehouse: and(isActiveUser, isWarehouseOwner),
      warehouses: isActiveUser,
      warehouseItems: and(isActiveUser, isMultipleWarehouseOwner),
    },
    Mutation: {
      '*': deny,
      addCharacter: isActiveUser,
      addWarehouse: isActiveUser,
      addItemsToWarehouse: and(isActiveUser, isWarehouseOwner),
      updateItemsInWarehouse: and(isActiveUser, isWarehouseOwner),
      removeItemsFromWarehouse: and(isActiveUser, isWarehouseOwner),
      removeWarehouse: and(isActiveUser, isWarehouseOwner),
      updateWarehouse: and(isActiveUser, isWarehouseOwner),
      removeCharacter: and(isActiveUser, isCharacterOwner),
      updateCharacter: and(isActiveUser, isCharacterOwner),
      register: and(isGuest, canRegister),
    },
  },
  { fallbackRule: allow, debug: true }
);

export default shieldMiddleware;
