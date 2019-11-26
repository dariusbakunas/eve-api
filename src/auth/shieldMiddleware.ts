import { rule, shield, and, or } from 'graphql-shield';
import { ApolloContext } from '../types';
import { MutationRegisterArgs } from '../__generated__/types';
import { IDataSources } from '../services';

const allow = rule()(() => true);
const deny = rule()(() => false);

const isCharacterOwner = rule()(async (parent, { id }, { user, dataSources }: ApolloContext & { dataSources: IDataSources }) => {
  const result = await dataSources.db.Character.query()
    .where('id', '=', id)
    .andWhere('ownerId', '=', user!.id)
    .count('*')
    .pluck('count(*)')
    .first();

  const count = (result as unknown) as number;
  return count === 1;
});

const isActiveUser = rule({ cache: 'contextual' })((parent, args, { user }: ApolloContext) => !!user && user.status === 'ACTIVE');

// current user email should match the one requested
const hasSameEmail = rule()((parent, args, { user }: ApolloContext) => !!user && user.email === args.email);

const canRegister = rule()((parent, args: MutationRegisterArgs, { user }: ApolloContext) => !!user && user.email === args.input.email);

const isGuest = rule()((parent, args, { user }: ApolloContext) => !!user && user.status === 'GUEST');

const shieldMiddleware = shield(
  {
    Query: {
      '*': deny,
      characters: isActiveUser,
      scopes: isActiveUser,
      userByEmail: hasSameEmail,
      marketOrders: isActiveUser,
      walletJournal: isActiveUser,
      walletTransactions: isActiveUser,
    },
    Mutation: {
      '*': deny,
      addCharacter: isActiveUser,
      removeCharacter: and(isActiveUser, isCharacterOwner),
      updateCharacter: and(isActiveUser, isCharacterOwner),
      register: and(isGuest, canRegister),
    },
  },
  { fallbackRule: allow, debug: true }
);

export default shieldMiddleware;
