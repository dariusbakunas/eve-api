import { Resolvers } from '../__generated__/types';
import { IResolverContext } from "../common";

export const characterResolvers: Resolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources: { db}, user: { id: userID } }) => {
      const characters = await db.character.findMany({
        where: {
          ownerId: userID,
        }
      });

      return characters.map((character) => ({
        ...character,
        id: `${character.id}`,
        scopes: character.scopes.split(' '),
      }));
    }
  }
}
