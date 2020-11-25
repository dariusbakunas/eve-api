import { applicationConfig } from '../utils/applicationConfig';
import { Character } from '../services/db/models/character';
import {
  CharacterSkillGroupArgs,
  MutationAddCharacterArgs,
  MutationRemoveCharacterArgs,
  MutationUpdateCharacterArgs,
  QueryCharacterArgs,
  RequireFields,
  Resolver,
  ResolversParentTypes,
  ResolversTypes,
  SkillGroup,
} from '../__generated__/types';
import { Corporation } from '../services/db/models/corporation';
import { InventoryItem } from '../services/db/models/InventoryItem';
import { InvGroup } from '../services/db/models/invGroup';
import { IResolverContext, Maybe, MaybeArrayResolver, MaybeResolver } from '../types';
import { JoinClause } from 'knex';
import { SkillMultiplier } from '../services/db/models/skillMultiplier';
import { SkillQueueItem as SkillQueueItemDB } from '../services/db/models/skillQueueItem';
import { UserInputError } from 'apollo-server-errors';
import moment from 'moment';
import property from 'lodash.property';

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
    characters: MaybeArrayResolver<Character, ResolversParentTypes['Query'], Context>;
    character: MaybeResolver<Character, ResolversParentTypes['Query'], Context, RequireFields<QueryCharacterArgs, 'id'>>;
  };
  Mutation: {
    addCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationAddCharacterArgs, 'code'>>;
    updateCharacter: Resolver<ResolversTypes['Character'], unknown, Context, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>;
    removeCharacter: Resolver<ResolversTypes['ID'], unknown, Context, RequireFields<MutationRemoveCharacterArgs, 'id'>>;
  };
  Character: {
    corporation: Resolver<Partial<Corporation>, Character, Context>;
    scopes: Resolver<Maybe<Array<ResolversTypes['String']>>, Character, Context>;
    skillGroups: Resolver<Array<Partial<SkillGroupWithCharacterId>>, Character, Context>;
    skillGroup: Resolver<Maybe<Partial<SkillGroupWithCharacterId>>, Character, Context, RequireFields<CharacterSkillGroupArgs, 'id'>>;
    skillQueue: Resolver<Array<SkillQueueItemDB>, Character, Context>;
  };
  SkillQueueItem: {
    position: Resolver<ResolversTypes['Int'], SkillQueueItemDB, Context>;
    skill: Resolver<ResolversTypes['Skill'], SkillQueueItemDB, Context>;
  };
  SkillGroup: {
    skills: Resolver<Maybe<Array<ResolversTypes['Skill']>>, SkillGroupWithCharacterId, Context>;
    totalSp: Resolver<Maybe<ResolversTypes['Int']>, SkillGroupWithCharacterId, Context>;
    totalLevels: Resolver<Maybe<ResolversTypes['Int']>, SkillGroupWithCharacterId, Context>;
    trainedSp: Resolver<Maybe<ResolversTypes['Int']>, SkillGroupWithCharacterId, Context>;
  };
}

const SKILL_GROUP_CATEGORY_ID = 16;
const LEVEL_V_SP = 256000;

const resolverMap: ICharacterResolvers<IResolverContext> = {
  Query: {
    characters: async (_, args, { dataSources, user: { id } }) => {
      return dataSources.db.Character.query().where('ownerId', id).orderBy('name');
    },
    character: async (_, { id }, { dataSources }) => {
      return dataSources.db.Character.query().findById(id);
    },
  },
  Mutation: {
    addCharacter: async (_, { code }, { dataSources: { esiAuth, db, crypt, esiApi }, user: { id: userId } }) => {
      const { config } = applicationConfig;
      try {
        const tokens = await esiAuth.getCharacterTokens(config.eveClientId, config.eveClientSecret, code);
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
      const { config } = applicationConfig;
      const tokens = await esiAuth.getCharacterTokens(config.eveClientId, config.eveClientSecret, code);
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
      const group: InvGroup = await dataSources.db.InvGroup.query().where('groupID', id).andWhere('categoryID', SKILL_GROUP_CATEGORY_ID).first();
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

      return skillGroups.map((group) => ({
        id: `${group.groupID}`,
        characterId,
        name: group.groupName!, // all skill groups have names
      }));
    },
    skillQueue: async ({ id: characterId }, args, { dataSources }) => {
      const queue: Array<SkillQueueItemDB> = await dataSources.db.SkillQueueItem.query().where('characterId', characterId).orderBy('queuePosition');
      return queue;
    },
  },
  SkillGroup: {
    skills: async ({ id, characterId }, args, { dataSources }) => {
      const knex = dataSources.knex;
      const skills: Array<Skill> = await dataSources.db.InventoryItem.query()
        .select('*')
        .leftJoin('characterSkills as characterSkill', function (this: JoinClause) {
          this.on('invTypes.typeID', 'characterSkill.skillId');
          this.andOn('characterSkill.characterId', knex.raw(characterId));
        })
        .where('groupID', id)
        .andWhere('published', true)
        .orderBy('typeName');

      const skillIds = skills.map((skill) => skill.typeID);
      const multipliers: Array<SkillMultiplier> = await dataSources.db.SkillMultiplier.query().whereIn('skillId', skillIds);
      const multiplierMap = multipliers.reduce<{ [key: number]: number }>((acc, multiplier) => {
        acc[multiplier.skillId] = multiplier.multiplier;
        return acc;
      }, {});

      return skills.map((skill) => ({
        id: `${skill.typeID}`,
        name: skill.typeName,
        multiplier: multiplierMap[skill.typeID],
        trainedSkillLevel: skill.trainedSkillLevel,
        activeSkillLevel: skill.activeSkillLevel,
        skillPointsInSkill: skill.skillPointsInSkill,
      }));
    },
    totalLevels: async ({ id }, args, { dataSources }) => {
      const skills = await dataSources.db.InventoryItem.query().select('typeID').where('groupID', id).andWhere('published', true).as('skills');
      return skills.length * 5;
    },
    totalSp: async ({ id }, args, { dataSources }) => {
      const skillSubquery = dataSources.db.InventoryItem.query().select('typeID').where('groupID', id).andWhere('published', true).as('skills');
      const totalSp = await dataSources.db.SkillMultiplier.query()
        .sum('skillMultipliers.multiplier as totalSp')
        .innerJoin(skillSubquery, function (this: JoinClause) {
          this.on('skills.typeID', 'skillMultipliers.skillId');
        })
        .pluck('totalSp')
        .first();
      return totalSp * LEVEL_V_SP;
    },
    trainedSp: async ({ id, characterId }, args, { dataSources }) => {
      return dataSources.db.InventoryItem.query()
        .sum('characterSkill.skillPointsInSkill as trainedSp')
        .as('trainedSp')
        .rightJoin('characterSkills as characterSkill', function (this: JoinClause) {
          this.on('invTypes.typeID', 'characterSkill.skillId').andOn('characterSkill.characterId', dataSources.knex.raw(characterId));
        })
        .where('groupID', id)
        .andWhere('published', true)
        .orderBy('typeName')
        .pluck('trainedSp')
        .first();
    },
  },
  SkillQueueItem: {
    position: property('queuePosition'),
    skill: async ({ characterId, skillId }, args, { dataSources }) => {
      // TODO: create skill loader
      const skill = await dataSources.db.CharacterSkill.query()
        .select('characterSkills.*', 'skillMultipliers.multiplier', 'invTypes.typeName')
        .join('invTypes', 'invTypes.typeID', 'characterSkills.skillId')
        .join('skillMultipliers', 'skillMultipliers.skillId', 'characterSkills.skillId')
        .where('characterId', characterId)
        .where('characterSkills.skillId', skillId)
        .first();

      // TODO: skill may be undefined

      return {
        id: `${skillId}`,
        name: skill.typeName,
        multiplier: skill.multiplier,
        trainedSkillLevel: skill.trainedSkillLevel,
        activeSkillLevel: skill.activeSkillLevel,
        skillPointsInSkill: skill.skillPointsInSkill,
      };
    },
  },
};

export default resolverMap;
