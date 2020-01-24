import { IResolverContext } from '../types';
import {
  Maybe,
  MutationRegisterArgs,
  QueryUserByEmailArgs,
  RequireFields,
  Resolver,
  Resolvers,
  ResolversParentTypes,
  ResolversTypes,
} from '../__generated__/types';
import { User, UserStatus } from '../services/db/models/user';
import { UserInputError } from 'apollo-server-express';
import request from '../utils/request';

interface IUserResolvers<Context> {
  Query: {
    userByEmail: Resolver<Maybe<ResolversTypes['User']>, ResolversParentTypes['Query'], Context, RequireFields<QueryUserByEmailArgs, 'email'>>;
  };
  Mutation: {
    register: Resolver<ResolversTypes['User'], ResolversParentTypes['Mutation'], Context, RequireFields<MutationRegisterArgs, 'input'>>;
  };
}

const resolvers: IUserResolvers<IResolverContext> = {
  Query: {
    userByEmail: async (_source, { email }, { dataSources, user: contextUser }) => {
      const { status } = contextUser;

      const user = await dataSources.db.User.query().findOne({
        email,
      });

      if (!user) {
        return null;
      }

      return {
        ...user,
        id: `${user.id}`,
        status,
      };
    },
  },
  Mutation: {
    register: async (_source, { input }, { dataSources }) => {
      const { email, username, code } = input;

      const exists = await dataSources.db.User.query()
        .select('username')
        .where({
          username: input.username,
        });

      if (exists.length) {
        throw new UserInputError('Username exists', {
          validationErrors: {
            username: 'Username exists',
          },
        });
      }

      // find invitation
      const invitation = await dataSources.db.Invitation.query().findOne({
        email,
      });

      if (!invitation || invitation.code !== code) {
        throw new UserInputError('Invitation code mismatch', {
          validationErrors: {
            code: 'Invalid code',
          },
        });
      }

      const newUser: Partial<User> = {
        email,
        username,
        status: UserStatus.Active,
      };

      const dbUser: User = await dataSources.db.User.query().insertAndFetch(newUser);

      await dataSources.db.Invitation.query().deleteById(invitation.id);

      return {
        ...dbUser,
        id: `${dbUser.id}`,
      };
    },
  },
};

export default resolvers;
