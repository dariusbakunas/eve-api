import {
  MutationAddCharacterArgs,
  MutationRemoveCharacterArgs,
  MutationUpdateCharacterArgs,
  RequireFields,
  Resolver,
  ResolversTypes,
} from '../__generated__/types';
import { IResolverContext, Maybe } from '../types';
import { Character } from '../services/db/models/character';
import { getAccessToken } from './common';
import { IDataSources } from '../services';
import { UserInputError } from 'apollo-server-errors';

const getCharacterInfo = async (id: number, esiApi: IDataSources['esiApi'], fieldName: string) => {
  const info = await esiApi.getCharacterInfo(id);
  return info[fieldName === 'securityStatus' ? 'security_status' : fieldName];
};

interface IResolvers<Context> {
  Query: {
    characters: Resolver<Array<Character>, any, Context>;
  };
  Mutation: {
    addCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationAddCharacterArgs, 'code'>>;
    updateCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>;
    removeCharacter: Resolver<ResolversTypes['ID'], unknown, Context, RequireFields<MutationRemoveCharacterArgs, 'id'>>;
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
    addCharacter: async (_, { code }, { dataSources: { esiAuth, db, crypt }, user: { id: userId } }) => {
      try {
        const tokens = await esiAuth.getCharacterTokens(process.env.EVE_CLIENT_ID!, process.env.EVE_CLIENT_SECRET!, code);
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;
        const expiresAt = expiresIn * 1000 + new Date().getTime();
        const { CharacterID, CharacterName, Scopes } = await esiAuth.verifyToken(accessToken);

        const user = await db.User.query().findById(userId);

        return user.$relatedQuery('characters').insert({
          id: CharacterID,
          expiresAt,
          name: CharacterName,
          accessToken: crypt.encrypt(accessToken),
          refreshToken: crypt.encrypt(refreshToken),
          scopes: Scopes,
        });
      } catch (e) {
        if (e.extensions && e.extensions.response) {
          const { url, body } = e.extensions.response;

          const message = `${e.message}: url: ${url}, description: ${body.error_description}`;
          throw new Error(message);
        }
        throw new Error(e.message);
      }
    },
    updateCharacter: async (_, { id, code }, { dataSources: { db, esiAuth } }) => {
      const tokens = await esiAuth.getCharacterTokens(process.env.EVE_CLIENT_ID!, process.env.EVE_CLIENT_SECRET!, code);
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;
      const expiresAt = expiresIn * 1000 + new Date().getTime();
      const { CharacterID, CharacterName, Scopes } = await esiAuth.verifyToken(accessToken);

      if (id !== `${CharacterID}`) {
        throw new UserInputError(`character '${CharacterName}' does not match original request`);
      }

      const character = await db.Character.query().findById(id);
      return character.$query().updateAndFetch({ scopes: Scopes, accessToken, refreshToken, expiresAt });
    },
    removeCharacter: async (_, { id }, { dataSources: { db } }) => {
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
    totalSp: async ({ id, accessToken, refreshToken, expiresAt, scopes }, args, { dataSources }: { dataSources: IDataSources }) => {
      if (scopes.split(' ').findIndex(scope => scope === 'esi-skills.read_skills.v1') === -1) {
        return null;
      }

      const token = await getAccessToken(id, accessToken, refreshToken, expiresAt, dataSources.db, dataSources.crypt, dataSources.esiAuth);

      const { total_sp: totalSp } = await dataSources.esiApi.getCharacterSkills(id, token);
      return totalSp;
    },
    securityStatus: ({ id }, args, { dataSources }, { fieldName }) => {
      return getCharacterInfo(id!, dataSources.esiApi, fieldName);
    },
  },
};

export default resolverMap;
