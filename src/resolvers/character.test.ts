import { makeExecutableSchema } from 'graphql-tools';
import { graphql, GraphQLSchema } from 'graphql';
import resolvers from './index';
import { IResolverContext } from '../types';
import { loadSchema } from '../schema/loadSchema';
import { Character } from '../services/db/models/character';
import { QueryMock } from '../utils/testUtils';

describe('Character Resolver', () => {
  let typeDefs;
  let schema: GraphQLSchema;
  let context: {
    dataSources: {
      db: {
        Character: typeof Character;
      };
    };
    user: {
      id: number;
    };
  };

  beforeAll(() => {
    context = {
      dataSources: {
        db: {
          Character,
        },
      },
      user: {
        id: 123,
      },
    };

    typeDefs = loadSchema();
    schema = makeExecutableSchema<IResolverContext>({ typeDefs, resolvers });
  });

  test('query: characters', async () => {
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
    expect(queryMock.whereFn).toHaveBeenCalledWith('ownerId', context.user.id);

    return expect(result).toEqual({
      data: {
        characters: [{ id: '1', name: 'test character 01' }],
      },
    });
  });
});
