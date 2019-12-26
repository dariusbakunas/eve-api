import { Blueprint as BlueprintDB } from '../services/db/models/blueprint';
import {
  BlueprintsOrderBy,
  Maybe,
  QueryBlueprintsArgs,
  QueryBuildInfoArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolverTypeWrapper,
} from '../__generated__/types';
import { Character as CharacterDB } from '../services/db/models/character';
import { getCharacter } from './common';
import { IndustryActivityMaterial } from '../services/db/models/industryActivityMaterial';
import { InvItemPartial, IResolverContext } from '../types';
import { UserInputError } from 'apollo-server-errors';

interface BlueprintsResponseDB {
  total: number;
  entries: BlueprintDB[];
}

const BUILD_ACTIVITY_ID = 1;
const RESEARCH_ACTIVITY_ID = 8;

interface BuildInfo {
  materials: Array<{
    typeID: number;
    quantity: number;
  }>;
  product: InvItemPartial;
  quantity: number;
  time: number;
}

interface IResolvers<Context> {
  Query: {
    blueprints: Resolver<BlueprintsResponseDB, ResolversParentTypes['Query'], Context, QueryBlueprintsArgs>;
    buildInfo: Resolver<
      Maybe<ResolverTypeWrapper<BuildInfo>>,
      ResolversParentTypes['Query'],
      Context,
      RequireFields<QueryBuildInfoArgs, 'blueprintId'>
    >;
  };
  Blueprint: {
    character: Resolver<CharacterDB, BlueprintDB, Context>;
    item: Resolver<InvItemPartial, BlueprintDB, Context>;
  };
  BuildMaterial: {
    item: Resolver<InvItemPartial, { typeID: number; quantity: number }, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    blueprints: async (_parent, { filter, orderBy, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.Blueprint.query()
          .select('blueprints.*', 'group.groupName as groupName')
          .join('invTypes as item', 'item.typeID', 'blueprints.typeId')
          .join('invGroups as group', 'item.groupID', 'group.groupID');

        if (filter) {
          if (filter.characterId) {
            if (characterIds.includes(+filter.characterId)) {
              query.where('characterId', filter.characterId);
            } else {
              throw new UserInputError('Invalid character id');
            }
          }
        }

        if (!filter || !filter.characterId) {
          query.where('characterId', 'in', characterIds);
        }

        // TODO: is there better way? categoryId still maps to Blueprints
        query.whereNot('item.typeName', 'like', '%reaction%');

        if (orderBy) {
          let orderByCol;
          const { column, order } = orderBy;

          switch (column) {
            case BlueprintsOrderBy.Name:
              orderByCol = 'item.typeName';
              break;
            case BlueprintsOrderBy.Character:
              query.join('characters as character', 'character.id', 'blueprints.characterId');
              orderByCol = 'character.name';
              break;
            case BlueprintsOrderBy.GroupName:
            case BlueprintsOrderBy.MaterialEfficiency:
            case BlueprintsOrderBy.TimeEfficiency:
            case BlueprintsOrderBy.MaxRuns:
              orderByCol = column;
              break;
          }

          if (orderByCol) {
            query.orderBy(orderByCol, order);

            if (orderByCol != 'item.typeName') {
              query.orderBy('item.typeName');
            }
          }
        }

        const blueprints = await query.page(index, size);

        return {
          total: blueprints.total,
          entries: blueprints.results,
        };
      }

      return {
        total: 0,
        entries: [],
      };
    },
    buildInfo: async (_parent, { blueprintId }, { dataSources }) => {
      const product = await dataSources.db.IndustryActivityProduct.query()
        .where('typeID', blueprintId)
        .where('activityID', BUILD_ACTIVITY_ID)
        .first();

      if (product) {
        const { productTypeID, quantity } = product;
        const item = await dataSources.loaders.invItemLoader.load(productTypeID);
        const activity = await dataSources.db.IndustryActivity.query()
          .where('typeID', blueprintId)
          .where('activityID', BUILD_ACTIVITY_ID)
          .first();
        const materials = await dataSources.db.IndustryActivityMaterial.query()
          .where('typeID', blueprintId)
          .where('activityID', BUILD_ACTIVITY_ID);
        const industryBlueprint = await dataSources.db.IndustryBlueprint.query()
          .where('typeID', blueprintId)
          .first();

        return {
          materials: materials.map((material: IndustryActivityMaterial) => ({
            typeID: material.materialTypeID,
            quantity: material.quantity,
          })),
          product: item!,
          quantity: quantity,
          time: activity.time,
          productionLimit: industryBlueprint.maxProductionLimit,
        };
      }

      return null;
    },
  },
  Blueprint: {
    item: async (blueprint, args, { dataSources }) => {
      const item = await dataSources.loaders.invItemLoader.load(blueprint.typeId);

      if (!item) {
        throw new Error(`Item id: ${blueprint.typeId} not found`);
      }

      return item;
    },
    character: async (blueprint, args, { dataSources }) => {
      return getCharacter(blueprint.characterId, dataSources.loaders);
    },
  },
  BuildMaterial: {
    item: async (parent, args, { dataSources }) => {
      const item = await dataSources.loaders.invItemLoader.load(parent.typeID);

      if (!item) {
        throw new Error(`Item id: ${parent.typeID} not found`);
      }

      return item;
    },
  },
};

export default resolverMap;
