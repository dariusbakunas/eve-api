import { Resolvers } from '../__generated__/types';
import {IResolverContext} from "../common";

export const characterResolvers: Resolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources}) => {
      return [];
    }
  }
}
