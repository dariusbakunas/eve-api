import { Character } from '../services/db/models/character';
import { getTestContext, QueryMock } from '../utils/testUtils';
import { graphql, GraphQLError, GraphQLSchema } from 'graphql';
import { IResolverContext } from '../types';
import { loadSchema } from '../schema/loadSchema';
import { makeExecutableSchema } from 'graphql-tools';
import { User } from '../services/db/models/user';
import resolvers from './index';
import moment = require('moment');
import { applicationConfig } from '../utils/applicationConfig';

const EVE_CLIENT_ID = 'TEST_CLIENT_ID';
const EVE_CLIENT_SECRET = 'TEST_CLIENT_SECRET';

describe('Character Resolver', () => {
  let typeDefs;
  let schema: GraphQLSchema;

  beforeAll(async () => {
    process.env = Object.assign(process.env, { EVE_CLIENT_ID, EVE_CLIENT_SECRET });
    await applicationConfig.load(false);
    typeDefs = loadSchema();
    schema = makeExecutableSchema<IResolverContext>({ typeDefs, resolvers });
  });

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2019-11-23T19:06:22.575Z').getTime());
  });

  test('query: characters', async () => {
    const context = getTestContext(123);
    const queryMock = QueryMock.spyOn(Character, 'query');
    queryMock.orderByFn.mockReturnValue([{ id: '1', name: 'test character 01' }]);

    const query = `
      query {
        characters {
          id
          name
        }
      }
    `;

    const result = await graphql(schema, query, null, context, {});
    expect(queryMock.whereFn).toHaveBeenCalledWith('ownerId', 123);

    return expect(result).toEqual({
      data: {
        characters: [{ id: '1', name: 'test character 01' }],
      },
    });
  });

  test('mutation: addCharacter', async () => {
    const context = getTestContext(123);

    const queryMock = QueryMock.spyOn(User, 'query');
    const insertMock = jest.fn();
    insertMock.mockReturnValue({
      id: 'TEST_CHARACTER_ID',
      name: 'TEST_CHARACTER_NAME',
    });

    const mockUser = {
      $relatedQuery: jest.fn().mockReturnValue({
        insert: insertMock,
      }),
    };

    context.dataSources.esiApi.getCharacterInfo.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/camelcase
      ancestry_id: 'TEST_ANCESTRY_ID',
      // eslint-disable-next-line @typescript-eslint/camelcase
      bloodline_id: 'TEST_BLOODLINE_ID',
      birthday: '2008-03-08T17:07:00Z',
      gender: 'male',
      // eslint-disable-next-line @typescript-eslint/camelcase
      race_id: 'TEST_RACE_ID',
    });

    queryMock.findByIdFn.mockReturnValue(mockUser);

    const query = `
      mutation AddCharacter($code: String!) {
        addCharacter(code: $code) {
          id          
          name         
        }
      }
    `;

    const result = await graphql(schema, query, null, context, {
      code: 'TEST_CODE',
    });

    expect(context.dataSources.esiAuth.getCharacterTokens).toHaveBeenCalledWith(EVE_CLIENT_ID, EVE_CLIENT_SECRET, 'TEST_CODE');
    expect(context.dataSources.esiAuth.verifyToken).toHaveBeenCalledWith('TEST_ACCESS_TOKEN');
    expect(context.dataSources.esiApi.getCharacterInfo).toHaveBeenCalledWith('TEST_CHARACTER_ID');
    expect(insertMock).toHaveBeenCalledWith({
      id: 'TEST_CHARACTER_ID',
      ancestryId: 'TEST_ANCESTRY_ID',
      birthday: moment('2008-03-08T17:07:00Z').toDate(),
      bloodlineId: 'TEST_BLOODLINE_ID',
      gender: 'male',
      raceId: 'TEST_RACE_ID',
      name: 'TEST_CHARACTER_NAME',
      expiresAt: 1574540982575,
      accessToken: 'TEST_ACCESS_TOKEN_encrypted',
      refreshToken: 'TEST_REFRESH_TOKEN_encrypted',
      scopes: 'scope01 scope02 scope03',
    });
    expect(result).toEqual({
      data: {
        addCharacter: {
          id: 'TEST_CHARACTER_ID',
          name: 'TEST_CHARACTER_NAME',
        },
      },
    });
  });

  test('mutation: updateCharacter', async () => {
    const context = getTestContext(123);
    const queryMock = QueryMock.spyOn(Character, 'query');

    const query = `
      mutation UpdateCharacter($id: ID!, $code: String!) {
        updateCharacter(id: $id, code: $code) {
          id          
          name         
        }
      }
    `;

    const updateAndFetchMock = jest.fn().mockReturnValue({
      id: 'TEST_CHARACTER_ID',
      name: 'TEST_CHARACTER_NAME',
    });
    const characterMock = {
      $query: () => ({
        updateAndFetch: updateAndFetchMock,
      }),
    };
    queryMock.findByIdFn.mockReturnValue(characterMock);

    const result = await graphql(schema, query, null, context, {
      id: 'TEST_CHARACTER_ID',
      code: 'TEST_CODE',
    });

    expect(context.dataSources.esiAuth.getCharacterTokens).toHaveBeenCalledWith(EVE_CLIENT_ID, EVE_CLIENT_SECRET, 'TEST_CODE');
    expect(context.dataSources.esiAuth.verifyToken).toHaveBeenCalledWith('TEST_ACCESS_TOKEN');
    expect(queryMock.findByIdFn).toHaveBeenCalledWith('TEST_CHARACTER_ID');
    expect(updateAndFetchMock).toHaveBeenCalledWith({
      scopes: 'scope01 scope02 scope03',
      accessToken: 'TEST_ACCESS_TOKEN_encrypted',
      refreshToken: 'TEST_REFRESH_TOKEN_encrypted',
      expiresAt: 1574540982575,
    });
    expect(result).toEqual({
      data: {
        updateCharacter: {
          id: 'TEST_CHARACTER_ID',
          name: 'TEST_CHARACTER_NAME',
        },
      },
    });
  });

  test('mutation: updateCharacter throws for mismatch character id', async () => {
    const context = getTestContext(123);

    const query = `
      mutation UpdateCharacter($id: ID!, $code: String!) {
        updateCharacter(id: $id, code: $code) {
          id          
          name         
        }
      }
    `;

    // verifyToken returns { CharacterID: 'TEST_CHARACTER_ID', CharacterName: 'TEST_CHARACTER_NAME' }
    const result = await graphql(schema, query, null, context, {
      id: 'TEST_CHARACTER_ID_MISMATCH',
      code: 'TEST_CODE',
    });

    expect(result).toEqual({
      data: null,
      errors: [new GraphQLError("character 'TEST_CHARACTER_NAME' does not match original request")],
    });
  });

  test('mutation: removeCharacter', async () => {
    const context = getTestContext(123);
    const queryMock = QueryMock.spyOn(Character, 'query');

    const query = `
      mutation RemoveCharacter($id: ID!) {
        removeCharacter(id: $id)
      }
    `;

    const result = await graphql(schema, query, null, context, {
      id: 'TEST_CHARACTER_ID',
    });

    expect(queryMock.deleteByIdFn).toHaveBeenCalledWith('TEST_CHARACTER_ID');
    expect(result).toEqual({
      data: {
        removeCharacter: 'TEST_CHARACTER_ID',
      },
    });
  });
});
