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
import { IEsiCharacterInfo } from '../services/esi/esiTypes';
import moment from 'moment';

const getCharacterInfo: <T extends keyof IEsiCharacterInfo>(
  id: number,
  esiApi: IDataSources['esiApi'],
  fieldName: T
) => Promise<IEsiCharacterInfo[T]> = async (id, esiApi, fieldName) => {
  const info = await esiApi.getCharacterInfo(id);
  return info[fieldName];
};

interface ICharacterResolvers<Context> {
  Query: {
    characters: Resolver<Array<Character>, any, Context>;
  };
  Mutation: {
    addCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationAddCharacterArgs, 'code'>>;
    updateCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>;
    removeCharacter: Resolver<ResolversTypes['ID'], unknown, Context, RequireFields<MutationRemoveCharacterArgs, 'id'>>;
  };
  Character: {
    corporation: Resolver<ResolversTypes['Corporation'], Character, Context>;
    totalSp: Resolver<Maybe<ResolversTypes['Int']>, Character, Context>;
    scopes: Resolver<Maybe<Array<ResolversTypes['String']>>, Character, Context>;
    securityStatus: Resolver<ResolversTypes['Float'], Character, Context>;
  };
}

const resolverMap: ICharacterResolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources, user: { id } }) => {
      return dataSources.db.Character.query()
        .where('ownerId', id)
        .orderBy('name');
    },
  },
  Mutation: {
    addCharacter: async (_, { code }, { dataSources: { esiAuth, db, crypt, esiApi }, user: { id: userId } }) => {
      try {
        const tokens = await esiAuth.getCharacterTokens(process.env.EVE_CLIENT_ID!, process.env.EVE_CLIENT_SECRET!, code);
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;
        const expiresAt = expiresIn * 1000 + new Date(Date.now()).getTime();
        const { CharacterID, CharacterName, Scopes } = await esiAuth.verifyToken(accessToken);

        const {
          ancestry_id: ancestryId,
          bloodline_id: bloodlineId,
          birthday,
          description,
          gender,
          race_id: raceId,
          corporation_id: corporationId,
          alliance_id: allianceId,
          faction_id: factionId,
          security_status: securityStatus,
          title,
        } = await esiApi.getCharacterInfo(CharacterID);

        const user = await db.User.query().findById(userId);

        return user.$relatedQuery('characters').insert({
          id: CharacterID,
          expiresAt,
          corporationId,
          allianceId,
          description,
          factionId,
          securityStatus,
          title,
          name: CharacterName,
          accessToken: crypt.encrypt(accessToken),
          refreshToken: crypt.encrypt(refreshToken),
          scopes: Scopes,
          ancestryId,
          bloodlineId,
          birthday: moment(birthday).toDate(),
          gender,
          raceId,
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
    updateCharacter: async (_, { id, code }, { dataSources: { db, crypt, esiAuth } }) => {
      const tokens = await esiAuth.getCharacterTokens(process.env.EVE_CLIENT_ID!, process.env.EVE_CLIENT_SECRET!, code);
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;
      const expiresAt = expiresIn * 1000 + new Date(Date.now()).getTime();
      const { CharacterID, CharacterName, Scopes } = await esiAuth.verifyToken(accessToken);

      if (id !== `${CharacterID}`) {
        throw new UserInputError(`character '${CharacterName}' does not match original request`);
      }

      const character = await db.Character.query().findById(id);
      return character.$query().updateAndFetch({
        scopes: Scopes,
        accessToken: crypt.encrypt(accessToken),
        refreshToken: crypt.encrypt(refreshToken),
        expiresAt,
      });
    },
    removeCharacter: async (_, { id }, { dataSources: { db } }) => {
      await db.Character.query().deleteById(id);
      return id;
    },
  },
  Character: {
    corporation: async ({ id }, args, { dataSources }) => {
      const { corporation_id: corporationId } = await dataSources.esiApi.getCharacterInfo(id);
      const corporationInfo = await dataSources.esiApi.getCorporationInfo(corporationId);

      return {
        id: `${corporationId}`,
        ...corporationInfo,
      };
    },
    scopes: ({ scopes }) => {
      return scopes.split(' ');
    },
    totalSp: async ({ id, accessToken, refreshToken, expiresAt, scopes }, args, { dataSources }: { dataSources: IDataSources }) => {
      if (scopes.split(' ').findIndex(scope => scope === 'esi-skills.read_skills.v1') === -1) {
        return null;
      }

      const token = await getAccessToken(id, accessToken, refreshToken, expiresAt, dataSources.db, dataSources.crypt, dataSources.esiAuth);

      const { total_sp: totalSp } = await dataSources.esiApi.getCharacterSkills(id, token);
      return totalSp;
    },
    securityStatus: ({ id }, args, { dataSources }) => {
      return getCharacterInfo(id!, dataSources.esiApi, 'security_status');
    },
  },
};

export default resolverMap;
