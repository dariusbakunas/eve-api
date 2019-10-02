import { IResolvers } from 'graphql-tools';
import property from 'lodash.property';

const resolverMap: IResolvers = {
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
