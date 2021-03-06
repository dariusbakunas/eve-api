import { Alliance } from '../services/db/models/alliance';
import { Corporation } from '../services/db/models/corporation';
import { IResolverContext } from '../types';
import { Maybe, Resolver, ResolversTypes } from '../__generated__/types';
import moment from 'moment';
import property from 'lodash.property';

//TODO: add esiApi type definitions
interface IResolvers<Context> {
  Corporation: {
    alliance: Resolver<Maybe<Partial<Alliance>>, Corporation, Context>;
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
        return Promise.resolve({
          creatorCorporationId: allianceInfo.creator_corporation_id,
          executorCorporationId: allianceInfo.executor_corporation_id,
          name: allianceInfo.name,
          dateFounded: moment(allianceInfo.date_founded).toDate(),
          factionId: allianceInfo.faction_id,
          ticker: allianceInfo.ticker,
        });
      }
    },
    memberCount: property('member_count'),
    dateFounded: property('date_founded'),
    taxRate: property('tax_rate'),
  },
};

export default resolverMap;
