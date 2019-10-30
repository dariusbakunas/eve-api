import { rule, shield, and, or } from 'graphql-shield';
import { ApolloContext } from '../types';
import { MutationRegisterArgs } from '../__generated__/types';

const allow = rule()(() => true);
const deny = rule()(() => false);

// current user email should match the one requested
const hasSameEmail = rule()(
  (parent, args, { user }: ApolloContext) => !!user && user.email === args.email
);

const canRegister = rule()(
  (parent, args: MutationRegisterArgs, { user }: ApolloContext) =>
    !!user && user.email === args.input.email
);

const isGuest = rule()(
  (parent, args, { user }: ApolloContext) => !!user && user.status === 'GUEST'
);

const shieldMiddleware = shield(
  {
    Query: {
      '*': deny,
      userByEmail: hasSameEmail,
    },
    Mutation: {
      '*': deny,
      register: and(isGuest, canRegister),
    },
  },
  { fallbackRule: allow, debug: true }
);

export default shieldMiddleware;
