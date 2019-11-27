import { Maybe, QueryProcessingLogsArgs, Resolver, ResolversTypes } from '../__generated__/types';
import { JobLogEntry } from '../services/db/models/jobLogEntry';
import { IResolverContext } from '../types';
import { UserInputError } from 'apollo-server-errors';
import { getCharacter } from './common';
import { Character } from '../services/db/models/character';

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

        if (filter && filter.characterId) {
          if (characterIds.includes(+filter.characterId)) {
            query.where('jobLogs.characterId', filter.characterId);
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
