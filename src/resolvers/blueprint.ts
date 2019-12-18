import { Blueprint, QueryBlueprintsArgs, Resolver, ResolversParentTypes, ResolversTypes, Scalars } from '../__generated__/types';
import { Blueprint as BlueprintDB } from '../services/db/models/blueprint';
import { Character as CharacterDB } from '../services/db/models/character';
import { getCharacter } from './common';
import { IResolverContext } from '../types';
import { UserInputError } from 'apollo-server-errors';

interface BlueprintsResponseDB {
  total: number;
  entries: BlueprintDB[];
}

interface IResolvers<Context> {
  Query: {
    blueprints: Resolver<BlueprintsResponseDB, ResolversParentTypes['Query'], Context, QueryBlueprintsArgs>;
  };
  Blueprint: {
    character: Resolver<CharacterDB, BlueprintDB, Context>;
    name: Resolver<ResolversTypes['String'], BlueprintDB, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    blueprints: async (_parent, { filter, page }, { dataSources, user }) => {
      const { index, size } = page || { index: 0, size: 10 };
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', user.id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.Blueprint.query();

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
  },
  Blueprint: {
    name: async (blueprint, args, { dataSources }) => {
      const item = await dataSources.loaders.invItemLoader.load(blueprint.typeId);

      if (!item) {
        throw new Error(`Item id: ${blueprint.typeId} not found`);
      }

      return item.typeName!;
    },
    character: async (blueprint, args, { dataSources }) => {
      return getCharacter(blueprint.characterId, dataSources.loaders);
    },
  },
};

export default resolverMap;
