import { Maybe, Resolver, ResolversParentTypes, ResolversTypes } from '../__generated__/types';
import { IResolverContext } from '../types';

interface IResolvers<Context> {
  Query: {
    warehouses: Resolver<Maybe<Array<ResolversTypes['Warehouse']>>, ResolversParentTypes['Query'], Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    warehouses: async (_parent, args, { dataSources, user: { id } }) => {
      return dataSources.db.Warehouse.query()
        .where('ownerId', id)
        .orderBy('name');
    },
  },
};

export default resolverMap;
