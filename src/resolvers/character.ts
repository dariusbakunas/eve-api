import type { Resolvers } from '../__generated__/types';
import type { IResolverContext } from "../common";
import { GraphQLError } from 'graphql';

export const characterResolvers: Resolvers<IResolverContext> = {
  Query: {
    characters: async (_, __, { dataSources: { db}, user: { id: userID } }) => {
      return db.character.findMany({
        where: {
          ownerId: userID,
        }
      });
    }
  },
  Mutation: {
    addCharacter: async (_, { code }, { dataSources: { db, esiApi, esiAuth, crypt }, user: { id: userID }}) => {
      const tokens = await esiAuth.getCharacterTokens(code);
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = tokens;
      const expiresAt = expiresIn * 1000 + new Date(Date.now()).getTime();
      const { CharacterID: characterId, CharacterName: characterName, Scopes: scopes } = await esiAuth.verifyToken(accessToken);

      const characterInfo = await esiApi.getCharacterInfo(characterId);

      const { corporation_id, alliance_id } = characterInfo;
      const esiCorporation = await esiApi.getCorporationInfo(corporation_id);

      const character = await db.character.create({
        data: {
          esiId: characterId,
          tokenExpiresAt: expiresAt,
          ancestryId: characterInfo.ancestry_id,
          name: characterName,
          scopes,
          gender: characterInfo.gender,
          bloodlineId: characterInfo.bloodline_id,
          birthday: characterInfo.birthday,
          description: characterInfo.description,
          raceId: characterInfo.race_id,
          factionId: characterInfo.faction_id,
          securityStatus: characterInfo.security_status,
          title: characterInfo.title,
          accessToken: crypt.encrypt(accessToken),
          refreshToken: crypt.encrypt(refreshToken),
          owner: {
            connect: {
              id: userID,
            }
          },
          corporation: {
            connectOrCreate: {
              where: {
                id: corporation_id,
              },
              create: {
                id: corporation_id,
                ceoId: esiCorporation.ceo_id,
                memberCount: esiCorporation.member_count,
                taxRate: esiCorporation.tax_rate,
                warEligible: !!esiCorporation.war_eligible,
                name: esiCorporation.name,
                creatorId: esiCorporation.creator_id,
                ticker: esiCorporation.ticker
              }
            }
          },
        }
      });

      if (alliance_id) {
        // upsert, connect to corp and character
        const esiAlliance = await esiApi.getAllianceInfo(alliance_id);

        await db.character.update({
          where: {
            id: character.id,
          },
          data: {
            alliance: {
              connectOrCreate: {
                where: {
                  id: alliance_id,
                },
                create: {
                  id: alliance_id,
                  creatorCorporationId: esiAlliance.creator_corporation_id,
                  creatorId: esiAlliance.creator_id,
                  name: esiAlliance.name,
                  dateFounded: esiAlliance.date_founded,
                  executorCorporationId: esiAlliance.executor_corporation_id,
                  factionId: esiAlliance.faction_id,
                  ticker: esiAlliance.ticker,
                }
              }
            }
          }
        });

        await db.corporation.update({
          where: {
            id: corporation_id,
          },
          data: {
            alliance: {
              connect: {
                id: alliance_id
              }
            }
          }
        });
      }

      return character;
    }
  },
  Character: {
    scopes: async ({ scopes }) =>{
      return scopes.split(' ');
    },
    accessToken: async ({ accessToken: encryptedToken }, _, { dataSources: { crypt }}) => {
      return crypt.decrypt(encryptedToken);
    },
    refreshToken: async ({ refreshToken: encryptedToken }, _, { dataSources: { crypt }}) => {
      return crypt.decrypt(encryptedToken);
    },
    corporation: async ({ corporationId }, _, { dataSources: { db } }) => {
      const corporation = await db.corporation.findUnique({
        where: {
          id: corporationId
        }
      });

      // TODO: should we create one if not found?
      if (!corporation) {
        throw new GraphQLError(`Corporation id: '${corporationId}' not found`, {
          extensions: {
            code: 'DB_ERROR',
          },
        });
      }

      return corporation;
    }
  }
}
