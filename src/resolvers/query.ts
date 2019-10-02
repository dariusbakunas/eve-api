import { IResolvers } from 'graphql-tools';

const resolverMap: IResolvers = {
  Query: {
    scopes: (_, args, { dataSources }) => {
      return dataSources.db.Scope.query();
    },
    characters: async (_, args, { dataSources, user: { id } }) => {
      return dataSources.db.Character.query().where('ownerId', id);
    },
  },
};

export default resolverMap;
