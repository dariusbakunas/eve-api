import { Request, Response, RESTDataSource } from 'apollo-datasource-rest';
import { RequestOptions } from 'apollo-datasource-rest/src/RESTDataSource';
import logger from '../../utils/logger';
import moment from 'moment';
import { KeyValueCache } from 'apollo-server-caching';
import { IEsiJournalEntry, IEsiWalletTransaction } from './esiTypes';

interface IWalletTransaction {
  id: number;
  clientId: number;
  characterId: number;
  date: Date;
  isBuy: boolean;
  isPersonal: boolean;
  journalRefId: number;
  locationId: number;
  quantity: 3;
  typeId: number;
  unitPrice: number;
}

interface IJournalEntry {
  amount?: number;
  balance?: number;
  characterId: number;
  contextId?: number;
  contextIdType?: number;
  date: Date;
  description: string;
  firstPartyId?: number;
  id: number;
  reason?: string;
  refType: string;
  secondPartyId?: string;
  tax?: number;
  taxReceiverId?: number;
}

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

  protected async didReceiveResponse<TResult = any>(
    response: Response,
    request: Request
  ): Promise<TResult> {
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

  async getCharacterSkills(characterId: number, token: string) {
    return this.get(`/characters/${characterId}/skills`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getWalletTransactions(characterId: number, token: string): Promise<IWalletTransaction[]> {
    const transactions = await this.get(
      `/characters/${characterId}/wallet/transactions/`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return transactions.map((t: IEsiWalletTransaction) => ({
      clientId: t.client_id,
      characterId: characterId,
      date: moment(t.date).toDate(),
      isBuy: t.is_buy,
      isPersonal: t.is_personal,
      journalRefId: t.journal_ref_id,
      locationId: t.location_id,
      quantity: t.quantity,
      id: t.transaction_id,
      typeId: t.type_id,
      unitPrice: t.unit_price,
    }));
  }

  async getJournalEntries(characterId: number, token: string): Promise<IJournalEntry[]> {
    const entries = await this.get(`/characters/${characterId}/wallet/journal`, undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return entries.map((entry: IEsiJournalEntry) => ({
      id: entry.id,
      amount: entry.amount,
      balance: entry.balance,
      characterId: characterId,
      contextId: entry.context_id,
      contextIdType: entry.context_id_type,
      date: moment(entry.date).toDate(),
      description: entry.description,
      firstPartyId: entry.first_party_id,
      reason: entry.reason,
      refType: entry.ref_type,
      secondPartyId: entry.second_party_id,
      tax: entry.tax,
      taxReceiverId: entry.tax_receiver_id,
    }));
  }

  async getCorporationInfo(corporationId: number) {
    return this.get(`/corporations/${corporationId}`);
  }

  async getAllianceInfo(allianceId: number) {
    return this.get(`/alliances/${allianceId}`);
  }
}

export default EsiAPI;
