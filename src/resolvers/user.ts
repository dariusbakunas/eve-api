import { Resolvers } from '../__generated__/types';

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
};

export default resolvers;
