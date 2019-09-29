import { IResolvers } from 'graphql-tools';

const resolverMap: IResolvers = {
  Character: {
    scopes: (parent, args, { dataSources }) => {
      return parent.scopes.split(' ');
    },
  },
};

export default resolverMap;
