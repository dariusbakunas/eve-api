import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import { Loaders } from '../services/db/loaders';
import { PartialUpdate } from 'objection';
import logger from '../utils/logger';
import { applicationConfig } from '../utils/applicationConfig';

export const getAccessToken = async (
  characterId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  db: IDataSources['db'],
  crypt: IDataSources['crypt'],
  esiAuth: IDataSources['esiAuth']
) => {
  const { config } = applicationConfig;

  if (new Date().getTime() < expiresAt - 1000 * 60) {
    return crypt.decrypt(accessToken);
  } else {
    logger.info(`Getting new access token for character: ${characterId}`);

    // get new tokens
    const tokens = await esiAuth.getAccessToken(config.eveClientId, config.eveClientSecret, crypt.decrypt(refreshToken));

    const update: PartialUpdate<Character> = {
      accessToken: crypt.encrypt(tokens.access_token),
      refreshToken: crypt.encrypt(tokens.refresh_token),
      expiresAt: tokens.expires_in * 1000 + new Date().getTime(),
    };

    await db.Character.query()
      .findById(characterId)
      .patch(update);

    return tokens.access_token;
  }
};

export const getCharacter: (characterId: number, loaders: Loaders) => Promise<Character> = async (characterId, loaders) => {
  const character = await loaders.characterLoader.load(characterId);

  if (!character) {
    throw new Error(`Character id: ${characterId} not found`);
  }

  return character;
};
