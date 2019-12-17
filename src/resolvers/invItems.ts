import { InventoryItem } from '../services/db/models/InventoryItem';
import { IResolverContext } from '../types';
import { QueryInvItemsArgs, Resolver, ResolversParentTypes, ResolversTypes } from '../__generated__/types';

interface IResolvers<Context> {
  Query: {
    invItems: Resolver<Array<ResolversTypes['InvItem']>, ResolversParentTypes['Query'], Context, QueryInvItemsArgs>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    invItems: async (_parent, { filter }, { dataSources }) => {
      const query = dataSources.db.InventoryItem.query()
        .select('invTypes.*', 'invGroup.groupName')
        .joinRelation('invGroup')
        .where('invTypes.published', true);

      if (filter) {
        if (filter.name) {
          query.where('typeName', 'like', `%${filter.name}%`);
        }
      }

      const items = await query.orderBy(['groupName', 'typeName']);

      return items.map((item: InventoryItem) => ({
        id: item.typeID,
        name: item.typeName,
        invGroup: {
          id: item.groupID,
          name: item.groupName,
        },
      }));
    },
  },
};

export default resolverMap;