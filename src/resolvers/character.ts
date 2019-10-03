import { IResolvers } from 'graphql-tools';
import logger from '../utils/logger';
import { IDataSources } from '../index';

const getCharacterInfo = async ({ id }, args, { dataSources }, { fieldName }) => {
  const info = await dataSources.esiApi.getCharacterInfo(id);
  return info[fieldName === 'securityStatus' ? 'security_status' : fieldName];
};

const getAccessToken = async (characterId, dataSources, accessToken, refreshToken, expiresAt) => {
  const { db, crypt, esiApi, esiAuth } = dataSources;

  if (new Date().getTime() < expiresAt - 1000 * 60) {
    return crypt.decrypt(accessToken);
  } else {
    logger.info(`Getting new access token for character: ${characterId}`);

    // get new tokens
    const tokens = await esiAuth.getAccessToken(
      process.env.EVE_CLIENT_ID,
      process.env.EVE_CLIENT_SECRET,
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

const resolverMap: IResolvers = {
  Character: {
    scopes: parent => {
      return parent.scopes.split(' ');
    },
    birthday: getCharacterInfo,
    corporation: async ({ id }, args, { dataSources }) => {
      const { corporation_id: corporationId } = await dataSources.esiApi.getCharacterInfo(id);
      const corporationInfo = await dataSources.esiApi.getCorporationInfo(corporationId);

      return {
        id: corporationId,
        ...corporationInfo,
      };
    },
    gender: getCharacterInfo,
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
    securityStatus: getCharacterInfo,
  },
};

export default resolverMap;
