import type { Request } from 'express';
import { dataSources } from './index';
import config from '../config';
import { ContextUser, getUser } from '../auth/getUser';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

export const context = async (req: Request, cache: KeyValueCache<string>) => {
  const auth0domain = config.get('auth0domain');

  const ds = dataSources({
    dbURL: `postgres://${config.get('db.user')}:${config.get('db.password')}@${config.get('db.host')}/${config.get('db.name')}`,
    eveEsiURL: config.get('eve.esiURL'),
    eveLoginURL: config.get('eve.loginURL'),
    clientID: config.get('eve.clientID'),
    clientSecret: config.get('eve.clientSecret'),
    cryptSecret: config.get('cryptSecret'),
    cache,
  });

  if (config.get('introspection') === 'true') {
    const user: ContextUser = {
      id: -1,
      email: 'introspection',
      status: 'INACTIVE',
      username: 'introspection'
    }

    return {
      dataSources: ds,
      user,
    }
  }

  const token = req.headers.authorization || '';
  const user = await getUser(ds.db, auth0domain, token, req.auth?.payload.sub);

  return {
    dataSources: ds,
    user,
  };
}