import { RESTDataSource } from 'apollo-datasource-rest';

interface IAccessTokenResponse {
  access_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}

interface ICreateUserResponse {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: Array<{
    connection: string;
    user_id: string;
    provider: string;
    isSocial: boolean;
  }>;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  username: string;
}

class Auth0API extends RESTDataSource {
  constructor(baseUrl: string) {
    super();
    this.baseURL = baseUrl;
  }

  async getAccessToken(): Promise<IAccessTokenResponse> {
    return this.post('/oauth/token', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      grant_type: 'client_credentials',
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: process.env.AUTH0_CLIENT_ID,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: 'https://eve-app.auth0.com/api/v2/',
    });
  }

  async createUser(accessToken: string, email: string, username: string, password: string): Promise<ICreateUserResponse> {
    return this.post(
      '/api/v2/users',
      {
        email,
        username,
        password,
        connection: 'Username-Password-Authentication',
        // eslint-disable-next-line @typescript-eslint/camelcase
        verify_email: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }
}

export default Auth0API;
