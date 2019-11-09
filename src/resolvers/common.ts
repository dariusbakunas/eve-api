import { IDataSources } from '../index';
import logger from '../utils/logger';
import { PartialUpdate } from 'objection';
import { Character } from '../services/db/models/character';

export const getAccessToken = async (
  characterId: number,
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  db: IDataSources['db'],
  crypt: IDataSources['crypt'],
  esiAuth: IDataSources['esiAuth']
) => {
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
