import { RESTDataSource } from 'apollo-datasource-rest';


class EsiAuth extends RESTDataSource {
  constructor(baseUrl) {
    super();
    this.baseURL = baseUrl;
  }

  async getCharacterTokens(clientId, clientSecret, code) {
    const authBuffer = new Buffer(`${clientId}:${clientSecret}`);

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

  async verifyToken(accessToken) {
    return this.get('/oauth/verify', undefined, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }
}

export default EsiAuth;
