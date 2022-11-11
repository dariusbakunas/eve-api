import type { MockContext } from '../services/contextMock';
import type { IResolverContext } from '../services/context';
import { mockContext } from '../services/contextMock';
import { createMockCharacter } from '../services/db/modelMocks';
import { Character } from '@prisma/client';
import { ApolloServer } from '@apollo/server';
import { loadSchema } from '../schema/loadSchema';
import resolvers from '../resolvers';
import assert from 'assert';

let mockCtx: MockContext;
let ctx: IResolverContext;
let testServer: ApolloServer<IResolverContext>;

const typeDefs = loadSchema();

beforeEach(() => {
  mockCtx = mockContext()
  ctx = mockCtx as unknown as IResolverContext

  testServer = new ApolloServer<IResolverContext>({
    typeDefs,
    resolvers,
  });
})

describe('Character Resolver', () => {
  it ('should return all characters', async () => {
    const character1 = createMockCharacter();
    const character2 = createMockCharacter();

    mockCtx.dataSources.db.character.findMany.mockResolvedValue([character1, character2])

    const { body } = await testServer.executeOperation({
      query: 'query GetCharacters { characters { name } }',
    }, {
      contextValue: ctx
    });

    assert(body.kind === 'single');
    expect(body.singleResult.errors).toBeUndefined();

    expect(body.singleResult.data).toEqual({
      characters: [
        {
          name: character1.name,
        },
        {
          name: character2.name
        }
      ]
    })
  })
})