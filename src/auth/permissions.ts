import { and, rule, shield } from 'graphql-shield';
import type { IResolverContext } from '../services/context';

const allow = rule()(() => true);
const deny = rule()(() => false);

const isActiveUser = rule({ cache: 'contextual' })((_, __, { user }: IResolverContext) => !!user && user.status === 'ACTIVE');

const isCharacterOwner = rule()(async (_, { id }, { user, dataSources: { db } }: IResolverContext) => {
  const count = await db.character.count({
    where: {
      id: id,
      ownerId: user.id,
    }
  })
  return count === 1;
});

export const permissions = shield({
  Query: {
    '*': deny,
    characters: isActiveUser,
    character: and(isActiveUser, isCharacterOwner),
  },
  Mutation: {
    '*': deny,
    addCharacter: isActiveUser,
  },
}, { fallbackRule: allow, debug: true });