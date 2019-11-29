import property from 'lodash.property';
import { Alliance, Maybe, Resolver, ResolversTypes } from '../__generated__/types';
import { IResolverContext } from '../types';
import { Corporation } from '../services/db/models/corporation';

//TODO: add esiApi type definitions
interface IResolvers<Context> {
  Corporation: {
    alliance: Resolver<Maybe<ResolversTypes['Alliance']>, Corporation, Context>;
    memberCount: Resolver<ResolversTypes['Int'], { member_count: number }, Context>;
    dateFounded: Resolver<Maybe<ResolversTypes['DateTime']>, { date_founded: Date }, Context>;
    taxRate: Resolver<ResolversTypes['Float'], { tax_rate: number }, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Corporation: {
    alliance: async ({ allianceId }, args, { dataSources }) => {
      if (!allianceId) {
        // NPC corporations do not have alliance_id
        return null;
      }

      const alliance = await dataSources.db.Alliance.query().findById(allianceId);

      if (alliance) {
        return alliance;
      } else {
        const allianceInfo = await dataSources.esiApi.getAllianceInfo(allianceId);

        const alliance: Partial<Alliance> = {
          id: `${allianceId}`,
          ...allianceInfo,
        };

        return alliance;
      }
    },
    memberCount: property('member_count'),
    dateFounded: property('date_founded'),
    taxRate: property('tax_rate'),
  },
};

export default resolverMap;
