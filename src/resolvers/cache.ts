import { IResolverContext } from '../types';
import { Maybe, MutationSetCacheArgs, QueryCacheArgs, RequireFields, Resolver, ResolversParentTypes, ResolversTypes } from '../__generated__/types';
import sjcl from 'sjcl';

interface IResolvers<Context> {
  Query: {
    cache: Resolver<Maybe<ResolversTypes['String']>, ResolversParentTypes['Query'], Context, RequireFields<QueryCacheArgs, 'key'>>;
  };
  Mutation: {
    setCache: Resolver<ResolversTypes['ID'], ResolversParentTypes['Query'], Context, RequireFields<MutationSetCacheArgs, 'key' | 'value'>>;
  };
}

const getCacheKey = (userId: number, key: string) => {
  const cacheKeyBits = sjcl.hash.sha256.hash(`${userId}:${key}`);
  return sjcl.codec.hex.fromBits(cacheKeyBits);
};

const resolverMap: IResolvers<IResolverContext> = {
  Query: {
    cache: async (_, { key }, { dataSources: { cache }, user: { id } }) => {
      const cacheKey = getCacheKey(id, key);
      const value = await cache.get(cacheKey);
      return value || null;
    },
  },
  Mutation: {
    setCache: async (_, { key, value }, { dataSources: { cache }, user: { id } }) => {
      const cacheKey = getCacheKey(id, key);
      await cache.set(cacheKey, value);
      return key;
    },
  },
};

export default resolverMap;
