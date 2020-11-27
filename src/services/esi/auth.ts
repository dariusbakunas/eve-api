import { RESTDataSource } from 'apollo-datasource-rest';

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

class EsiAuth extends RESTDataSource {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }

  // TODO: move clientId and secret to constructor
  getCharacterTokens(clientId: string, clientSecret: string, code: string) {
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`);

    return this.post<ITokens>(
      '/oauth/token',
      JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: 'authorization_code',
        code,
      }),
      {
        headers: {
          Authorization: `Basic ${authBuffer.toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`);

    return this.post(
      '/oauth/token',
      JSON.stringify({
        // eslint-disable-next-line @typescript-eslint/camelcase
        grant_type: 'refresh_token',
        // eslint-disable-next-line @typescript-eslint/camelcase
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${authBuffer.toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  verifyToken(accessToken: string) {
    return this.get<ITokenVerifyResponse>('/oauth/verify', undefined, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}

export default EsiAuth;
