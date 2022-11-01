import { rule, shield } from 'graphql-shield';
import { IResolverContext } from '../common';

const allow = rule()(() => true);
const deny = rule()(() => false);

const isActiveUser = rule({ cache: 'contextual' })((parent, args, { user }: IResolverContext) => !!user && user.status === 'ACTIVE');

export const permissions = shield({
  Query: {
    '*': deny,
    characters: isActiveUser,
  },
  // Mutation: {
  //   '*': deny,
  // },
}, { fallbackRule: allow, debug: true });