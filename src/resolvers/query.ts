import { IResolvers } from "graphql-tools";

const resolverMap: IResolvers = {
  Query: {
    currentUser: (_, args, { user }) => {
      return user;
    }
  }
}

export default resolverMap;
