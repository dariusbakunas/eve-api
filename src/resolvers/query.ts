import { IResolvers } from 'graphql-tools';

const resolverMap: IResolvers = {
  Query: {
    scopes: (_, args, { dataSources }) => {
      return dataSources.db.Scope.query();
    },
  },
};

export default resolverMap;
