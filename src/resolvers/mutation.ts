import { IResolvers } from 'graphql-tools';
import logger from '../utils/logger';

const resolverMap: IResolvers = {
  Mutation: {
    addCharacter: async (
      _,
      { input: { code } },
      { dataSources: { esiAuth, db, crypt, esiApi }, user: { id: userId } }
    ) => {
      try {
        const tokens = await esiAuth.getCharacterTokens(
          process.env.EVE_CLIENT_ID,
          process.env.EVE_CLIENT_SECRET,
          code
        );

        const {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        } = tokens;

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
  },
};

export default resolverMap;
