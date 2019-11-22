import { Request, Response, RESTDataSource } from 'apollo-datasource-rest';
import { RequestOptions } from 'apollo-datasource-rest/src/RESTDataSource';
import logger from '../../utils/logger';
import { KeyValueCache } from 'apollo-server-caching';
import { IEsiBookmark, IEsiJournalEntry, IEsiMarketOrder, IEsiWalletTransaction } from './esiTypes';

class EsiAPI extends RESTDataSource {
  private cache: KeyValueCache;

  constructor(baseUrl: string, cache: KeyValueCache) {
    super();
    this.baseURL = baseUrl;
    this.cache = cache;
  }
  async getCharacterInfo(characterId: number) {
    return this.get(`/characters/${characterId}`);
  }

  protected async willSendRequest(request: RequestOptions): Promise<void> {
    if (request.method === 'GET') {
      const url = this.resolveURL(request);
      const cacheKey = `${url}`;

      const value = await this.cache.get(cacheKey);

      if (value) {
        const { etag } = JSON.parse(value);
        request.headers.set('If-None-Match', etag);
      }
    }
  }

  protected async didReceiveResponse<TResult = any>(response: Response, request: Request): Promise<TResult> {
    const cacheKey = `${request.url}`;
    if (response.ok) {
      const data = (await (this.parseBody(response) as any)) as Promise<TResult>;
      const etag = response.headers.get('etag');

      if (etag) {
        await this.cache.set(
          cacheKey,
          JSON.stringify({
            etag: etag.replace(/['"]+/g, ''),
            data,
          }),
          {
            ttl: 3600, // 1 hour
          }
        );
      }

      return data;
    } else if (response.status === 304) {
      // etag was used and 0 length response was returned, return cached entry
      const value = await this.cache.get(cacheKey);

      if (!value) {
        logger.warning(`Could not get cache entry for ${cacheKey} for 304 response`);
        throw new Error(`Could not get cache entry for ${cacheKey} for 304 response`);
      }

      const { data } = JSON.parse(value);
      return data;
    } else {
      throw await this.errorFromResponse(response);
    }
  }

  async getBookmarks(characterId: number, token: string): Promise<IEsiBookmark[]> {
    return this.get(`/characters/${characterId}/bookmarks`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getUniverseNames(ids: number[]) {
    return this.post('/universe/names', ids);
  }

  async getCharacterSkills(characterId: number, token: string) {
    return this.get(`/characters/${characterId}/skills`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getWalletTransactions(characterId: number, token: string): Promise<IEsiWalletTransaction[]> {
    return this.get(`/characters/${characterId}/wallet/transactions/`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getMarketOrders(characterId: number, token: string): Promise<IEsiMarketOrder[]> {
    return this.get(`/characters/${characterId}/orders`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getJournalEntries(characterId: number, token: string): Promise<IEsiJournalEntry[]> {
    return this.get(`/characters/${characterId}/wallet/journal`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getCorporationInfo(corporationId: number) {
    return this.get(`/corporations/${corporationId}`);
  }

  async getAllianceInfo(allianceId: number) {
    return this.get(`/alliances/${allianceId}`);
  }
}

export default EsiAPI;
