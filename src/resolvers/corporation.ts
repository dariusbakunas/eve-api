import type { Resolvers } from '../__generated__/types';
import type { IResolverContext } from '../services/context';

export const corporationResolvers: Resolvers<IResolverContext> = {
  Corporation: {
    alliance: async ({ allianceId }, _, { dataSources: { db }}) => {
      if (allianceId) {
       return db.alliance.findUnique({
          where: {
            id: allianceId
          }
        });
      }

      return null;
    }
  }
}