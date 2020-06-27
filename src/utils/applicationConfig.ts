import { SecretManagerServiceClient } from '@google-cloud/secret-manager/build/src';
import logger from './logger';

export interface IApplicationConfig {
  auth0Domain: string;
  auth0Audience: string;
  gcProjectId?: string;
  dbSecret: string;
  dbName: string;
  dbUser: string;
  dbHost?: string;
  dbPort?: number | null;
  dbSocket?: string;
  tokenSecret: string;
  eveClientId: string;
  eveClientSecret: string;
  eveLoginUrl: string;
  eveEsiUrl: string;
}

const REQUIRED_CONFIG: Array<keyof IApplicationConfig> = [
  'auth0Domain',
  'auth0Audience',
  'dbName',
  'dbUser',
  'dbSecret',
  'tokenSecret',
  'eveClientId',
  'eveClientSecret',
  'eveEsiUrl',
  'eveLoginUrl',
];

class ApplicationConfig {
  private _config: IApplicationConfig;

  constructor() {
    this._config = {
      auth0Domain: '',
      auth0Audience: '',
      dbName: '',
      dbUser: '',
      dbSecret: '',
      tokenSecret: '',
      eveClientId: '',
      eveClientSecret: '',
      eveEsiUrl: '',
      eveLoginUrl: '',
    };
  }

  private async loadGCloudSecret(
    // @ts-ignore
    secretClient: SecretManagerServiceClient,
    projectId: string,
    secretName: string,
    version = 'latest'
  ): Promise<string> {
    const path = `projects/${projectId}/secrets/${secretName}/versions/${version}`;
    const [response] = await secretClient.accessSecretVersion({
      name: path,
    });
    return response?.payload?.data?.toString() ?? '';
  }

  private async loadLatestGCloudSecrets(
    // @ts-ignore
    secretClient: SecretManagerServiceClient,
    projectId: string,
    secretNames: string[]
  ): Promise<Array<string>> {
    return Promise.all(secretNames.map(secret => this.loadGCloudSecret(secretClient, projectId, secret)));
  }

  private validateConfig() {
    REQUIRED_CONFIG.forEach(key => {
      const value = this.config[key];

      if (!value || value === '') {
        throw new Error(`Missing configuration entry for ${key}`);
      }
    });

    if (!this.config.dbHost && !this.config.dbSocket) {
      throw new Error(`dbHost or dbSocket configuration entry is missing`);
    }
  }

  private getConfigFromEnv(): IApplicationConfig {
    return {
      auth0Domain: process.env['AUTH0_DOMAIN'] || '',
      auth0Audience: process.env['AUTH0_AUDIENCE'] || '',
      eveClientId: process.env['EVE_CLIENT_ID'] || '',
      eveClientSecret: process.env['EVE_CLIENT_SECRET'] || '',
      eveEsiUrl: process.env['EVE_ESI_URL'] || '',
      eveLoginUrl: process.env['EVE_LOGIN_URL'] || '',
      dbSecret: process.env['DB_PASSWORD'] || '',
      dbName: process.env['DB_NAME'] || '',
      dbUser: process.env['DB_USER'] || '',
      dbHost: process.env['DB_HOST'] || '',
      dbPort: process.env['DB_PORT'] ? +process.env['DB_PORT'] : null,
      tokenSecret: process.env['TOKEN_SECRET'] || '',
    };
  }

  async load(validate = true) {
    if (process.env.NODE_ENV === 'development') {
      this._config = this.getConfigFromEnv();
    } else {
      // TODO: add support for deployments to different clouds
      if (process.env.APP_ENGINE === 'true') {
        const secretClient = new SecretManagerServiceClient();
        const projectId = await secretClient.getProjectId();

        const [
          dbName,
          dbUser,
          dbSocket,
          dbSecret,
          tokenSecret,
          eveClientId,
          eveClientSecret,
          eveLoginUrl,
          eveEsiUrl,
          auth0Audience,
          auth0Domain,
        ] = await this.loadLatestGCloudSecrets(secretClient, projectId, [
          'EVE_DB_NAME',
          'EVE_DB_USER',
          'EVE_DB_SOCKET',
          'EVE_DB_PSW',
          'TOKEN_SECRET',
          'EVE_CLIENT_ID',
          'EVE_CLIENT_SECRET',
          'EVE_LOGIN_URL',
          'EVE_ESI_URL',
          'AUTH0_AUDIENCE',
          'AUTH0_DOMAIN',
        ]);

        this._config = {
          auth0Audience,
          auth0Domain,
          eveClientId,
          eveClientSecret,
          eveEsiUrl,
          eveLoginUrl,
          gcProjectId: projectId,
          dbName,
          dbUser,
          dbSocket,
          dbSecret,
          tokenSecret,
        };
      } else {
        this._config = this.getConfigFromEnv();
      }
    }

    if (validate) {
      this.validateConfig();
    }

    if (process.env.NODE_ENV === 'development') {
      logger.info(`Loaded config: ${JSON.stringify(this._config)}`);
    }
  }

  get config(): Readonly<IApplicationConfig> {
    return this._config;
  }
}

export const applicationConfig = new ApplicationConfig();
