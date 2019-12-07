import { getTestContext, QueryMock } from '../utils/testUtils';
import { graphql, GraphQLError, GraphQLSchema } from 'graphql';
import { IResolverContext } from '../types';
import { loadSchema } from '../schema/loadSchema';
import { makeExecutableSchema } from 'graphql-tools';
import { Warehouse } from '../services/db/models/warehouse';
import resolvers from './index';

const EVE_CLIENT_ID = 'TEST_CLIENT_ID';
const EVE_CLIENT_SECRET = 'TEST_CLIENT_SECRET';

describe('Warehouse Resolcer', () => {
  let typeDefs = loadSchema();
  let schema: GraphQLSchema;

  beforeAll(() => {
    typeDefs = loadSchema();
    schema = makeExecutableSchema<IResolverContext>({ typeDefs, resolvers });
    process.env = Object.assign(process.env, { EVE_CLIENT_ID, EVE_CLIENT_SECRET });
  });

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => new Date('2019-11-23T19:06:22.575Z').getTime());
  });

  test('query: warehouses', async () => {
    const context = getTestContext(123);
    const queryMock = QueryMock.spyOn(Warehouse, 'query');
    queryMock.orderByFn.mockReturnValue([{ id: '1', name: 'warehouse 01' }]);

    const query = `
      query {
        warehouses {
          id
          name
        }
      }
    `;

    const result = await graphql(schema, query, null, context, {});
    expect(queryMock.whereFn).toHaveBeenCalledWith('ownerId', 123);

    return expect(result).toEqual({
      data: {
        warehouses: [{ id: '1', name: 'warehouse 01' }],
      },
    });
  });
});
