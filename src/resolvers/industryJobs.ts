import { IndustryJobPartial, InvItemPartial, IResolverContext, Maybe } from '../types';
import { QueryIndustryJobsArgs, Resolver, ResolversParentTypes, ResolversTypes } from '../__generated__/types';
import { UserInputError } from 'apollo-server-errors';

interface IndustryJobsPaged {
  jobs: Array<IndustryJobPartial>;
  total: number;
}

interface IIndustryJobResolvers<Context> {
  Query: {
    industryJobs: Resolver<IndustryJobsPaged, ResolversParentTypes['Query'], Context, QueryIndustryJobsArgs>;
  };
  IndustryJob: {
    activity: Resolver<ResolversTypes['IndustryActivity'], IndustryJobPartial, Context>;
    product: Resolver<Maybe<InvItemPartial>, IndustryJobPartial, Context>;
  };
}

const resolverMap: IIndustryJobResolvers<IResolverContext> = {
  Query: {
    industryJobs: async (_, { filter, orderBy, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.IndustryJob.query()
          .select('industryJobs.*')
          .join('invTypes as item', 'item.typeID', 'industryJobs.productTypeId');

        if (filter) {
          if (filter.installerId) {
            if (characterIds.includes(+filter.installerId)) {
              query.where('industryJobs.installerId', filter.installerId);
            } else {
              throw new UserInputError('Invalid installer id');
            }
          } else {
            query.where('industryJobs.installerId', 'in', characterIds);
          }
        }

        if (!filter || !filter.installerId) {
          query.where('industryJobs.installerId', 'in', characterIds);
        }

        const industryJobs = await query.page(index, size);

        return {
          total: industryJobs.total,
          jobs: industryJobs.results,
        };
      }

      return {
        total: 0,
        jobs: [],
      };
    },
  },
  IndustryJob: {
    activity: async ({ activityId }, args, { dataSources: { db, loaders } }) => {
      const ACTIVITIES: { [key: number]: string } = {
        0: 'None',
        1: 'Manufacturing',
        2: 'Researching Technology',
        3: 'Researching Time Efficiency',
        4: 'Researching Material Efficiency',
        5: 'Copying',
        6: 'Duplicating',
        7: 'Reverse Engineering',
        8: 'Invention',
        9: 'Reactions',
      };

      return {
        id: `${activityId}`,
        name: ACTIVITIES[activityId] || 'None',
      };
    },
    product: async ({ productTypeId }, args, { dataSources: { db, loaders } }) => {
      if (!productTypeId) {
        return null;
      }

      const item = await loaders.invItemLoader.load(productTypeId);

      if (!item) {
        throw new Error(`Unable to load item ID: ${productTypeId}`);
      }

      return item;
    },
  },
};

export default resolverMap;
