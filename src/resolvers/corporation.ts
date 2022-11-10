import { Resolvers } from '../__generated__/types';
import { IResolverContext } from '../common';

export const corporationResolvers: Resolvers<IResolverContext> = {
  Corporation: {
    alliance: async ({ allianceId }, _, { dataSources: { db, esiApi }}) => {
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