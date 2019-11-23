import { makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLSchema } from 'graphql';
import resolvers from './index';
import { IResolverContext } from '../types';
import { loadSchema } from '../schema/loadSchema';
import { Character } from '../services/db/models/character';
import { getTestContext, QueryMock } from '../utils/testUtils';
import { User } from '../services/db/models/user';

const EVE_CLIENT_ID = 'TEST_CLIENT_ID';
const EVE_CLIENT_SECRET = 'TEST_CLIENT_SECRET';

describe('Character Resolver', () => {
  let typeDefs;
  let schema: GraphQLSchema;

  beforeAll(() => {
    typeDefs = loadSchema();
    schema = makeExecutableSchema<IResolverContext>({ typeDefs, resolvers });
    process.env = Object.assign(process.env, { EVE_CLIENT_ID, EVE_CLIENT_SECRET });
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
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2019, 12, 1).getTime());
    const context = getTestContext(123);
    context.dataSources.esiAuth.getCharacterTokens.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: 'TEST_ACCESS_TOKEN',
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: 'TEST_REFRESH_TOKEN',
      // eslint-disable-next-line @typescript-eslint/camelcase
      expires_in: 5000,
    });

    context.dataSources.esiAuth.verifyToken.mockReturnValue({
      CharacterID: 'TEST_CHARACTER_ID',
      CharacterName: 'TEST_CHARACTER_NAME',
      Scopes: 'scope01 scope02 scope03',
    });

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
    expect(insertMock).toHaveBeenCalledWith({
      id: 'TEST_CHARACTER_ID',
      name: 'TEST_CHARACTER_NAME',
      expiresAt: 1577859800000, // 1577854800000 (mocked timestamp) + expiresIn * 1000
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
});
