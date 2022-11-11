import { RESTDataSource } from '@apollo/datasource-rest';
import type { IEsiAllianceInfo, IEsiCharacterInfo, IEsiCorporationInfo } from './types';
import type { DataSourceConfig } from '@apollo/datasource-rest/src/RESTDataSource';

// https://www.apollographql.com/docs/apollo-server/data/fetching-rest
class EsiAPI extends RESTDataSource {
  constructor(baseUrl: string, config?: DataSourceConfig) {
    super(config);
    this.baseURL = baseUrl;
  }

  async getCharacterInfo(characterId: number): Promise<IEsiCharacterInfo> {
    return this.get(`/characters/${characterId}`);
  }

  async getCorporationInfo(corporationId: number): Promise<IEsiCorporationInfo> {
    return this.get(`/corporations/${corporationId}`);
  }

  async getAllianceInfo(allianceId: number): Promise<IEsiAllianceInfo> {
    return this.get<IEsiAllianceInfo>(`/alliances/${allianceId}`);
  }
}

export default EsiAPI;