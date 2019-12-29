import {
  IEsiAllianceInfo,
  IEsiBlueprint,
  IEsiBookmark,
  IEsiCharacterInfo,
  IEsiCharacterMarketOrder,
  IEsiCharacterSkills,
  IEsiCorporationInfo,
  IEsiIndustryJob,
  IEsiJournalEntry,
  IEsiMarketOrder,
  IEsiPagedResponse,
  IEsiSkillQueueItem,
  IEsiWalletTransaction,
} from './esiTypes';
import { KeyValueCache } from 'apollo-server-caching';
import { Request, Response, RESTDataSource } from 'apollo-datasource-rest';
import { RequestOptions } from 'apollo-datasource-rest/src/RESTDataSource';
import logger from '../../utils/logger';

class EsiAPI extends RESTDataSource {
  private cache: KeyValueCache;

  constructor(baseUrl: string, cache: KeyValueCache) {
    super();
    this.baseURL = baseUrl;
    this.cache = cache;
  }
  async getCharacterInfo(characterId: number): Promise<IEsiCharacterInfo> {
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

  protected async didReceiveResponse(response: Response, request: Request) {
    const cacheKey = `${request.url}`;
    if (response.ok) {
      const parsedResponse = (await (this.parseBody(response) as any)) as Promise<any>;
      const etag = response.headers.get('etag');
      const pages = response.headers.get('x-pages');

      const data = pages
        ? {
            pages,
            data: parsedResponse,
          }
        : parsedResponse;

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

  async getBlueprints(characterId: number, token: string): Promise<IEsiBlueprint[]> {
    return this.get(`/characters/${characterId}/blueprints`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getUniverseNames(ids: number[]) {
    return this.post('/universe/names', ids);
  }

  async getCharacterSkills(characterId: number, token: string): Promise<IEsiCharacterSkills> {
    return this.get(`/characters/${characterId}/skills`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getCharacterIndustryJobs(characterId: number, token: string): Promise<IEsiIndustryJob[]> {
    return this.get(`/characters/${characterId}/industry/jobs?include_completed=true`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getCharacterSkillQueue(characterId: number, token: string): Promise<IEsiSkillQueueItem[]> {
    return this.get(`/characters/${characterId}/skillqueue`, undefined, {
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

  async getMarketOrders(regionId: number, page: number): Promise<IEsiPagedResponse<IEsiMarketOrder[]>> {
    return this.get(`/markets/${regionId}/orders?page=${page}`, undefined, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 4000,
    });
  }

  async getCharacterMarketOrders(characterId: number, token: string): Promise<IEsiCharacterMarketOrder[]> {
    return this.get(`/characters/${characterId}/orders`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getOrderHistory(characterId: number, token: string): Promise<IEsiCharacterMarketOrder[]> {
    return this.get(`/characters/${characterId}/orders/history`, undefined, {
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

  async getCorporationInfo(corporationId: number): Promise<IEsiCorporationInfo> {
    return this.get(`/corporations/${corporationId}`);
  }

  async getAllianceInfo(allianceId: number): Promise<IEsiAllianceInfo> {
    return this.get(`/alliances/${allianceId}`);
  }
}

export default EsiAPI;
