import logger from '../utils/logger';
import { IDataSources } from '../index';
import { Resolver, ResolversTypes } from '../__generated__/types';
import { IResolverContext, Maybe } from '../types';
import { Character } from '../services/db/models/character';

const getCharacterInfo = async (id: number, esiApi: IDataSources['esiApi'], fieldName: string) => {
  const info = await esiApi.getCharacterInfo(id);
  return info[fieldName === 'securityStatus' ? 'security_status' : fieldName];
};

const getAccessToken = async (
  characterId: number,
  dataSources: IDataSources,
  accessToken: string,
  refreshToken: string,
  expiresAt: number
) => {
  const { db, crypt, esiAuth } = dataSources;

  if (new Date().getTime() < expiresAt - 1000 * 60) {
    return crypt.decrypt(accessToken);
  } else {
    logger.info(`Getting new access token for character: ${characterId}`);

    // get new tokens
    const tokens = await esiAuth.getAccessToken(
      process.env.EVE_CLIENT_ID!,
      process.env.EVE_CLIENT_SECRET!,
      crypt.decrypt(refreshToken)
    );

    await db.Character.query()
      .findById(characterId)
      .patch({
        accessToken: crypt.encrypt(tokens.access_token),
        refreshToken: crypt.encrypt(tokens.refresh_token),
        expiresAt: tokens.expires_in * 1000 + new Date().getTime(),
      });

    return tokens.access_token;
  }
};

interface IResolvers<Context> {
  Query: {
    characters: Resolver<Array<Character>, any, Context>;
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

      const token = await getAccessToken(id, dataSources, accessToken, refreshToken, expiresAt);

      const { total_sp: totalSp } = await dataSources.esiApi.getCharacterSkills(id, token);
      return totalSp;
    },
    securityStatus: ({ id }, args, { dataSources }, { fieldName }) => {
      return getCharacterInfo(id!, dataSources.esiApi, fieldName);
    },
  },
};

export default resolverMap;
