import { RESTDataSource } from 'apollo-datasource-rest';

class EsiAuth extends RESTDataSource {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }

  // TODO: move clientId and secret to constructor
  async getCharacterTokens(clientId: string, clientSecret: string, code: string) {
    const authBuffer = Buffer.from(`${clientId}:${clientSecret}`);

    return this.post(
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

  async getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
    const authBuffer = new Buffer(`${clientId}:${clientSecret}`);

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

  async verifyToken(accessToken: string) {
    return this.get('/oauth/verify', undefined, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}

export default EsiAuth;
