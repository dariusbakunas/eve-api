import { IResolvers } from "graphql-tools";

const resolverMap: IResolvers = {
  Query: {
    test: () => {
      return "test";
    }
  }
}

export default resolverMap;
