import { InvCategoryPartial, InvGroupPartial, IResolverContext } from '../types';
import { Resolver, ResolversTypes } from '../__generated__/types';
import property from 'lodash.property';

interface IResolvers<Context> {
  InvGroup: {
    id?: Resolver<ResolversTypes['ID'], InvGroupPartial, Context>;
    name?: Resolver<ResolversTypes['String'], InvGroupPartial, Context>;
    category?: Resolver<InvCategoryPartial, InvGroupPartial, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  InvGroup: {
    id: property('groupID'),
    name: property('groupName'),
    category: async (parent, args, { dataSources: { loaders } }) => {
      const category = await loaders.invCategoryLoader.load(parent.categoryID);

      if (category) {
        return category;
      }

      throw new Error(`Could not load category ID: ${parent.categoryID}`);
    },
  },
};

export default resolverMap;
