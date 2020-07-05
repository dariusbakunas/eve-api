import { Character } from '../services/db/models/character';
import { getCharacter } from './common';
import { IResolverContext } from '../types';
import { JobLogEntry } from '../services/db/models/jobLogEntry';
import { Maybe, QueryProcessingLogsArgs, Resolver, ResolversTypes } from '../__generated__/types';
import { UserInputError } from 'apollo-server-errors';

interface IProcessingResolvers<Context> {
  Query: {
    processingLogs: Resolver<Array<ResolversTypes['ProcessingLogEntry']>, JobLogEntry, Context, QueryProcessingLogsArgs>;
  };
  ProcessingLogEntry: {
    character: Resolver<Maybe<Partial<Character>>, JobLogEntry, Context>;
  };
}

const resolverMap: IProcessingResolvers<IResolverContext> = {
  Query: {
    processingLogs: async (_, { filter }, { dataSources, user: { id } }) => {
      const characterIds = await dataSources.db.Character.query()
        .select('id')
        .where('ownerId', id)
        .pluck('id');

      if (characterIds.length) {
        const query = dataSources.db.JobLogEntry.query().select('jobLogs.*');
        const validIds = new Set(characterIds);

        if (filter && filter.characterIds && filter.characterIds.length) {
          if (filter.characterIds.every(id => validIds.has(+id))) {
            query.where('jobLogs.characterId', 'in', filter.characterIds);
          } else {
            throw new UserInputError('Invalid character id');
          }
        } else {
          query.where('jobLogs.characterId', 'in', characterIds);
        }

        return query.orderBy('createdAt', 'desc');
      }

      return [];
    },
  },
  ProcessingLogEntry: {
    character: async (parent, args, { dataSources }): Promise<Maybe<Partial<Character>>> => {
      if (parent.characterId) {
        return getCharacter(parent.characterId, dataSources.loaders);
      } else {
        return null;
      }
    },
  },
};

export default resolverMap;
