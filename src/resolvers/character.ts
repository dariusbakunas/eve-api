import {
  MutationRemoveCharacterArgs,
  RequireFields,
  Resolver,
  ResolversTypes,
} from '../__generated__/types';
import { IResolverContext, Maybe } from '../types';
import { Character } from '../services/db/models/character';
import { getAccessToken } from './common';
import { IDataSources } from '../services';

const getCharacterInfo = async (id: number, esiApi: IDataSources['esiApi'], fieldName: string) => {
  const info = await esiApi.getCharacterInfo(id);
  return info[fieldName === 'securityStatus' ? 'security_status' : fieldName];
};

interface IResolvers<Context> {
  Query: {
    characters: Resolver<Array<Character>, any, Context>;
  };
  Mutation: {
    removeCharacter: Resolver<
      ResolversTypes['ID'],
      any,
      Context,
      RequireFields<MutationRemoveCharacterArgs, 'id'>
    >;
  };
  Character: {
    birthday: Resolver<ResolversTypes['DateTime'], Character, Context>;
    corporation: Resolver<ResolversTypes['Corporation'], Character, Context>;
    gender: Resolver<ResolversTypes['String'], Character, Context>;
    totalSp: Resolver<Maybe<ResolversTypes['Int']>, Character, Context>;
    scopes: Resolver<Maybe<Array<ResolversTypes['String']>>, Character, Context>;
    securityStatus: Resolver<ResolversTypes['Float'], Character, Context>;
  };
}

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources, user: { id } }) => {
      return dataSources.db.Character.query().where('ownerId', id);
    },
  },
  Mutation: {
    removeCharacter: async (_, { id }, { dataSources: { db }, user: { id: userId } }) => {
      await db.Character.query().deleteById(id);
      return id;
    },
  },
  Character: {
    birthday: ({ id }, args, { dataSources }, { fieldName }) => {
      return getCharacterInfo(id, dataSources.esiApi, fieldName);
    },
    corporation: async ({ id }, args, { dataSources }) => {
      const { corporation_id: corporationId } = await dataSources.esiApi.getCharacterInfo(id);
      const corporationInfo = await dataSources.esiApi.getCorporationInfo(corporationId);

      return {
        id: corporationId,
        ...corporationInfo,
      };
    },
    scopes: ({ scopes }) => {
      return scopes.split(' ');
    },
    gender: ({ id }, args, { dataSources }, { fieldName }) => {
      return getCharacterInfo(id!, dataSources.esiApi, fieldName);
    },
    totalSp: async (
      { id, accessToken, refreshToken, expiresAt, scopes },
      args,
      { dataSources }: { dataSources: IDataSources }
    ) => {
      if (scopes.split(' ').findIndex(scope => scope === 'esi-skills.read_skills.v1') === -1) {
        return null;
      }

      const token = await getAccessToken(
        id,
        accessToken,
        refreshToken,
        expiresAt,
        dataSources.db,
        dataSources.crypt,
        dataSources.esiAuth
      );

      const { total_sp: totalSp } = await dataSources.esiApi.getCharacterSkills(id, token);
      return totalSp;
    },
    securityStatus: ({ id }, args, { dataSources }, { fieldName }) => {
      return getCharacterInfo(id!, dataSources.esiApi, fieldName);
    },
  },
};

export default resolverMap;
