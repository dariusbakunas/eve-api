import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  auth0domain: {
    doc: 'Auth0 domain',
    format: String,
    default: 'https://eve-app.auth0.com',
    nullable: false,
  },
  apiAudience: {
    doc: 'API audience for validating JWT token',
    format: String,
    default: 'https://eve-api',
    nullable: false,
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 4000,
    env: 'PORT',
    arg: 'port'
  },
});

const env = config.get('env');
config.loadFile('./config/' + env + '.json');
config.validate({ allowed: 'strict' });

export default config;
