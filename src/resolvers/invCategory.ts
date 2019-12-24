import { InvCategoryPartial, IResolverContext } from '../types';
import { Resolver, ResolversTypes } from '../__generated__/types';
import property from 'lodash.property';

interface IResolvers<Context> {
  InvCategory: {
    id?: Resolver<ResolversTypes['ID'], InvCategoryPartial, Context>;
    name?: Resolver<ResolversTypes['String'], InvCategoryPartial, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  InvCategory: {
    id: property('categoryID'),
    name: property('categoryName'),
  },
};

export default resolverMap;
