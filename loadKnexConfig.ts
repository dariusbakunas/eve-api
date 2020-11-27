import Knex = require('knex');
import { IApplicationConfig } from './src/utils/applicationConfig';

export const loadKnexConfig = (applicationConfig: IApplicationConfig): Knex.Config => {
  const config: Knex.Config = {
    client: 'mysql2',
    connection: {
      database: applicationConfig.dbName,
      user: applicationConfig.dbUser,
      password: applicationConfig.dbSecret,
      timezone: '+00:00',
    },
    debug: true,
    pool: {
      min: 2,
      max: 10,
      afterCreate: function (connection: any, callback: (err: any, connection: any) => void) {
        connection.query("SET time_zone='+00:00';", function (err: any) {
          callback(err, connection);
        });
      },
    },
  };

  if (applicationConfig.dbSocket) {
    // @ts-ignore
    config.connection.socketPath = applicationConfig.dbSocket;
  } else if (applicationConfig.dbHost) {
    // @ts-ignore
    config.connection.host = applicationConfig.dbHost;
  }

  if (applicationConfig.dbPort) {
    // @ts-ignore
    config.connection.port = applicationConfig.dbPort;
  }

  return config;
};
