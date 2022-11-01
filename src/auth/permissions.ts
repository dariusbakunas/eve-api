import { rule, shield } from 'graphql-shield';
import { ApolloContext } from '../index';

const allow = rule()(() => true);
const deny = rule()(() => false);

const isActiveUser = rule({ cache: 'contextual' })((parent, args, { user }: ApolloContext) => !!user && user.status === 'ACTIVE');

export const permissions = shield({
  Query: {
    '*': deny,
    characters: isActiveUser,
  },
  // Mutation: {
  //   '*': deny,
  // },
}, { fallbackRule: allow, debug: true });