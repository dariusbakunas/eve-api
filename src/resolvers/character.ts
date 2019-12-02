import {
  CharacterSkillGroupArgs,
  MutationAddCharacterArgs,
  MutationRemoveCharacterArgs,
  MutationUpdateCharacterArgs,
  QueryCharacterArgs,
  RequireFields,
  Resolver,
  ResolversTypes,
  SkillGroup,
} from '../__generated__/types';
import { IResolverContext, Maybe } from '../types';
import { Character } from '../services/db/models/character';
import { UserInputError } from 'apollo-server-errors';
import moment from 'moment';
import { Corporation } from '../services/db/models/corporation';
import { InvGroup } from '../services/db/models/invGroup';
import { InventoryItem } from '../services/db/models/InventoryItem';
import { SkillMultiplier } from '../services/db/models/skillMultiplier';
import { JoinClause } from 'knex';
import { QueryBuilder } from 'objection';
import { CharacterSkill } from '../services/db/models/characterSkill';

interface SkillGroupWithCharacterId extends SkillGroup {
  characterId: number;
}

interface Skill extends InventoryItem {
  activeSkillLevel?: number;
  trainedSkillLevel?: number;
  skillPointsInSkill?: number;
}

interface ICharacterResolvers<Context> {
  Query: {
    characters: Resolver<Array<Character>, any, Context>;
    character: Resolver<Maybe<ResolversTypes['Character']>, any, Context, RequireFields<QueryCharacterArgs, 'id'>>;
  };
  Mutation: {
    addCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationAddCharacterArgs, 'code'>>;
    updateCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>;
    removeCharacter: Resolver<ResolversTypes['ID'], unknown, Context, RequireFields<MutationRemoveCharacterArgs, 'id'>>;
  };
  Character: {
    corporation: Resolver<Partial<Corporation>, Character, Context>;
    scopes: Resolver<Maybe<Array<ResolversTypes['String']>>, Character, Context>;
    skillGroups: Resolver<Array<SkillGroupWithCharacterId>, Character, Context>;
    skillGroup: Resolver<Maybe<SkillGroupWithCharacterId>, Character, Context, RequireFields<CharacterSkillGroupArgs, 'id'>>;
  };
  SkillGroup: {
    skills: Resolver<Maybe<Array<ResolversTypes['Skill']>>, SkillGroupWithCharacterId, Context>;
    totalSp: Resolver<Maybe<ResolversTypes['Int']>, SkillGroupWithCharacterId, Context>;
  };
}

const SKILL_GROUP_CATEGORY_ID = 16;
const LEVEL_V_SP = 256000;

const resolverMap: ICharacterResolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources, user: { id } }) => {
      return dataSources.db.Character.query()
        .where('ownerId', id)
        .orderBy('name');
    },
    character: async (_, { id }, { dataSources }) => {
      return dataSources.db.Character.query().findById(id);
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
    corporation: async ({ corporationId }, args, { dataSources }): Promise<Partial<Corporation>> => {
      const corporation: Corporation = await dataSources.db.Corporation.query().findById(corporationId);

      if (corporation) {
        return corporation;
      } else {
        const response = await dataSources.esiApi.getCorporationInfo(corporationId);

        return {
          id: corporationId,
          allianceId: response.alliance_id,
          name: response.name,
          memberCount: response.member_count,
          taxRate: response.tax_rate,
          ticker: response.ticker,
        };
      }
    },
    scopes: ({ scopes }) => {
      return scopes.split(' ');
    },
    skillGroup: async ({ id: characterId }, { id }, { dataSources }) => {
      const group: InvGroup = await dataSources.db.InvGroup.query()
        .where('groupID', id)
        .andWhere('categoryID', SKILL_GROUP_CATEGORY_ID)
        .first();
      return {
        id: `${group.groupID}`,
        characterId,
        name: group.groupName!, // all skill groups have names
      };
    },
    skillGroups: async ({ id: characterId }, args, { dataSources }) => {
      const skillGroups: Array<InvGroup> = await dataSources.db.InvGroup.query()
        .where('published', true)
        .andWhere('categoryID', SKILL_GROUP_CATEGORY_ID)
        .orderBy('groupName');

      return skillGroups.map(group => ({
        id: `${group.groupID}`,
        characterId,
        name: group.groupName!, // all skill groups have names
      }));
    },
  },
  SkillGroup: {
    skills: async ({ id, characterId }, args, { dataSources }) => {
      const skills: Array<Skill> = await dataSources.db.InventoryItem.query()
        .select('*')
        .leftJoin('characterSkills as characterSkill', 'invTypes.typeID', 'characterSkill.skillId')
        .where((builder: QueryBuilder<CharacterSkill>) => {
          builder.where('characterSkill.characterId', characterId).orWhereNull('characterSkill.characterId');
        })
        .andWhere('groupID', id)
        .andWhere('published', true)
        .orderBy('typeName');

      const skillIds = skills.map(skill => skill.typeID);
      const multipliers: Array<SkillMultiplier> = await dataSources.db.SkillMultiplier.query().whereIn('skillId', skillIds);
      const multiplierMap = multipliers.reduce<{ [key: number]: number }>((acc, multiplier) => {
        acc[multiplier.skillId] = multiplier.multiplier;
        return acc;
      }, {});

      return skills.map(skill => ({
        id: `${skill.typeID}`,
        name: skill.typeName,
        multiplier: multiplierMap[skill.typeID],
        trainedSkillLevel: skill.trainedSkillLevel,
        activeSkillLevel: skill.activeSkillLevel,
        skillPointsInSkill: skill.skillPointsInSkill,
      }));
    },
    totalSp: async ({ id }, args, { dataSources }) => {
      const skillSubquery = dataSources.db.InventoryItem.query()
        .select('typeID')
        .where('groupID', id)
        .andWhere('published', true)
        .as('skills');
      const totalSp = await dataSources.db.SkillMultiplier.query()
        .sum('skillMultipliers.multiplier as totalSp')
        .innerJoin(skillSubquery, function(this: JoinClause) {
          this.on('skills.typeID', 'skillMultipliers.skillId');
        })
        .pluck('totalSp')
        .first();
      return totalSp * LEVEL_V_SP;
    },
  },
};

export default resolverMap;
