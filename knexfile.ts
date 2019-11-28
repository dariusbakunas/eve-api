module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DEV_DB_HOST,
      database: process.env.DEV_DB_DATABASE,
      user: process.env.DEV_DB_USERNAME,
      password: process.env.DEV_DB_PASSWORD,
      timezone: '+00:00',
    },
    pool: {
      afterCreate: function(connection: any, callback: (err: any, connection: any) => void) {
        connection.query("SET time_zone='+00:00';", function(err: any) {
          callback(err, connection);
        });
      },
    },
    migrations: {
      directory: __dirname + '/src/services/db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: __dirname + '/src/services/db/seeds',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.PD_DB_HOST,
      database: process.env.PD_DB_DATABASE,
      user: process.env.PD_DB_USERNAME,
      password: process.env.PD_DB_PASSWORD,
      timezone: '+00:00',
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function(connection: any, callback: (err: any, connection: any) => void) {
        connection.query("SET time_zone='+00:00';", function(err: any) {
          callback(err, connection);
        });
      },
    },
    migrations: {
      directory: __dirname + '/src/services/db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: __dirname + '/src/services/db/seeds',
    },
  },
};
