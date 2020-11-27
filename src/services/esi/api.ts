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
import { Request, Response, RESTDataSource } from 'apollo-datasource-rest';

class EsiAPI extends RESTDataSource {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }
  async getCharacterInfo(characterId: number): Promise<IEsiCharacterInfo> {
    return this.get(`/characters/${characterId}`);
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
    return this.get<IEsiAllianceInfo>(`/alliances/${allianceId}`);
  }
}

export default EsiAPI;
