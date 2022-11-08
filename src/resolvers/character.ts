import { Resolvers } from '../__generated__/types';
import { IResolverContext } from "../common";

export const characterResolvers: Resolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources: { db}, user: { id: userID } }) => {
      const characters = await db.character.findMany({
        where: {
          ownerId: userID,
        }
      });

      return characters.map((character) => ({
        ...character,
        id: `${character.id}`,
        scopes: character.scopes.split(' '),
      }));
    }
  },
  Mutation: {
    addCharacter: async (_, { code }, { dataSources: { db, esiApi, esiAuth, crypt }, user: { id: userID }}) => {
      const tokens = await esiAuth.getCharacterTokens(code);
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;
      const expiresAt = expiresIn * 1000 + new Date(Date.now()).getTime();
      const { CharacterID: characterId, CharacterName: characterName, Scopes: scopes } = await esiAuth.verifyToken(accessToken);

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
      } = await esiApi.getCharacterInfo(characterId);

      const character = await db.character.create({
        data: {
          ownerId: userID,
          esiId: characterId,
          tokenExpiresAt: expiresAt,
          ancestryId,
          name: characterName,
          scopes,
          gender,
          bloodlineId,
          birthday,
          description,
          raceId,
          corporationId,
          allianceId,
          factionId,
          securityStatus,
          title,
          accessToken: crypt.encrypt(accessToken),
          refreshToken: crypt.encrypt(refreshToken)
        }
      });

      return {
        ...character,
        id: `${character.id}`,
        scopes: character.scopes.split(' '),
      }
    }
  }
}
