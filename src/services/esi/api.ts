import { RESTDataSource } from 'apollo-datasource-rest';

class EsiAPI extends RESTDataSource {
  constructor(baseUrl) {
    super();
    this.baseURL = baseUrl;
  }
  async getCharacterInfo(characterId: number) {
    return this.get(`/characters/${characterId}`);
  }

  async getCorporationInfo(corporationId: number) {
    return this.get(`/corporations/${corporationId}`);
  }

  async getAllianceInfo(allianceId: number) {
    return this.get(`/alliances/${allianceId}`);
  }
}

export default EsiAPI;
