import { IResolverContext } from '../types';
import { QueryInvItemsArgs, Resolver, ResolversParentTypes, ResolversTypes } from '../__generated__/types';
import { InventoryItem } from '../services/db/models/InventoryItem';

interface IResolvers<Context> {
  Query: {
    invItems: Resolver<Array<ResolversTypes['InvItem']>, ResolversParentTypes['Query'], Context, QueryInvItemsArgs>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    invItems: async (_parent, { filter }, { dataSources }) => {
      const query = dataSources.db.InventoryItem.query().where('published', true);

      if (filter) {
        if (filter.name) {
          query.where('typeName', 'like', `%${filter.name}%`);
        }
      }

      const items = await query.orderBy('typeName');

      return items.map((item: InventoryItem) => ({
        id: item.typeID,
        name: item.typeName,
      }));
    },
  },
};

export default resolverMap;
