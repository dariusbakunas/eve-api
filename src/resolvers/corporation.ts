import property from 'lodash.property';
import { Maybe, Resolver, ResolversTypes } from '../__generated__/types';
import { IResolverContext } from '../types';

//TODO: add esiApi type definitions
interface IResolvers<Context> {
  Corporation: {
    alliance: Resolver<Maybe<ResolversTypes['Alliance']>, { alliance_id: number }, Context>;
    memberCount: Resolver<ResolversTypes['Int'], { member_count: number }, Context>;
    dateFounded: Resolver<Maybe<ResolversTypes['DateTime']>, { date_founded: Date }, Context>;
    taxRate: Resolver<ResolversTypes['Float'], { tax_rate: number }, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Corporation: {
    alliance: async ({ alliance_id: allianceId }, args, { dataSources }) => {
      if (!allianceId) {
        // NPC corporations do not have alliance_id
        return null;
      }

      const allianceInfo = await dataSources.esiApi.getAllianceInfo(allianceId);
      return {
        id: allianceId,
        ...allianceInfo,
      };
    },
    memberCount: property('member_count'),
    dateFounded: property('date_founded'),
    taxRate: property('tax_rate'),
  },
};

export default resolverMap;
