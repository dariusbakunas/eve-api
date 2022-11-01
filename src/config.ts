import convict from 'convict';

/**
 * To require an env var
 * use
 *    default: '',
 *    format: 'required-string',
 */
convict.addFormats({
  'required-string': {
    validate: (val: string): void => {
      if (val === '') {
        throw new Error('Required value cannot be empty')
      }
    },
    coerce: (val: string | null): string | undefined => {
      if (val === null) {
        return undefined
      }
      return val
    }
  }
})

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  auth0domain: {
    doc: 'Auth0 domain',
    format: 'required-string',
    default: '',
    nullable: false,
  },
  apiAudience: {
    doc: 'API audience for validating JWT token',
    format: 'required-string',
    default: '',
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
