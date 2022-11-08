import { Request, Response, RESTDataSource } from 'apollo-datasource-rest';
import { IEsiCharacterInfo } from './types';

class EsiAPI extends RESTDataSource {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }

  async getCharacterInfo(characterId: number): Promise<IEsiCharacterInfo> {
    return this.get(`/characters/${characterId}`);
  }
}

export default EsiAPI;