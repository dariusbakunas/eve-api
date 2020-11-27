import { IResolverContext } from '../types';
import { User as DbUser, UserStatus } from '../services/db/models/user';
import {
  Maybe,
  MutationRegisterArgs,
  QueryUserByEmailArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  User,
} from '../__generated__/types';
import { UserInputError } from 'apollo-server-express';

interface IUserResolvers<Context> {
  Query: {
    userByEmail: Resolver<Maybe<User>, ResolversParentTypes['Query'], Context, RequireFields<QueryUserByEmailArgs, 'email'>>;
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
        id: `${user.id}`,
        status: user.status as UserStatus,
        username: user.username,
        email: user.email,
      };
    },
  },
  Mutation: {
    register: async (_source, { input }, { dataSources }) => {
      const { email, username, code } = input;

      const exists = await dataSources.db.User.query().select('username').where({
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

      const newUser: Partial<DbUser> = {
        email,
        username,
        status: UserStatus.Active,
      };

      const dbUser = await dataSources.db.User.query().insertAndFetch(newUser);

      await dataSources.db.Invitation.query().deleteById(invitation.id);

      return {
        ...dbUser,
        id: `${dbUser.id}`,
      };
    },
  },
};

export default resolvers;
