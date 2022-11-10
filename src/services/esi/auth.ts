import { RESTDataSource } from '@apollo/datasource-rest';
import { DataSourceConfig } from '@apollo/datasource-rest/src/RESTDataSource';

interface ITokens {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

interface ITokenVerifyResponse {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

// https://www.apollographql.com/docs/apollo-server/data/fetching-rest
class EsiAuth extends RESTDataSource {
  private readonly clientID: string;
  private readonly clientSecret: string;

  constructor(baseUrl: string, clientID: string, clientSecret: string, config?: DataSourceConfig) {
    super(config);
    this.baseURL = baseUrl;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
  }

  getCharacterTokens(code: string) {
    const authBuffer = Buffer.from(`${this.clientID}:${this.clientSecret}`);

    return this.post<ITokens>(
      '/oauth/token',
      {
        body: {
          grant_type: 'authorization_code',
          code,
        },
        headers: {
          Authorization: `Basic ${authBuffer.toString('base64')}`,
          'content-type': 'application/json',
        },
      },
    );
  }

  verifyToken(accessToken: string) {
    return this.get<ITokenVerifyResponse>('/oauth/verify', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}

export default EsiAuth;