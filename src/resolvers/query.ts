import { IResolvers } from "graphql-tools";

const resolverMap: IResolvers = {
  Query: {
    currentUser: (_, args, { user }) => {
      return user;
    },
    scopes: (_, args, { dataSources }) => {
      return dataSources.db.Scope.query();
    }
  }
}

export default resolverMap;
