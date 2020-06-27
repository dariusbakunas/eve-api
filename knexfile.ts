const localConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
    extension: 'ts',
  },
  seeds: {
    directory: __dirname + '/src/services/db/seeds',
  },
};

module.exports = {
  development: {
    ...localConfig,
  },
  production: {
    ...localConfig,
  },
  staging: {
    ...localConfig,
  },
};
