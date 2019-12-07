import { Resolvers } from '../__generated__/types';
import { User, UserStatus } from '../services/db/models/user';
import { UserInputError } from 'apollo-server-express';

const resolvers: Resolvers = {
  Query: {
    userByEmail: async (_source, { email }, { dataSources }) => {
      const user = await dataSources.db.User.query().findOne({
        email,
      });

      if (!user) {
        return null;
      }

      return {
        ...user,
        id: `${user.id}`,
      };
    },
  },
  Mutation: {
    register: async (_source, { input }, { dataSources }) => {
      const { email, firstName, lastName, username, code } = input;

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
        firstName,
        lastName,
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
