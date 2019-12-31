import { InMemoryLRUCache } from 'apollo-server-caching';
import Crypt from '../services/crypt';
import db from '../services/db';
import EsiAPI from '../services/esi/api';
import EsiAuth from '../services/esi/auth';

export const initDataSources = () => {
  const dataSources = {
    esiAuth: new EsiAuth(process.env.EVE_LOGIN_URL!),
    esiApi: new EsiAPI(process.env.EVE_ESI_URL!),
    db: db,
    crypt: new Crypt(process.env.TOKEN_SECRET!),
  };

  dataSources.esiApi.initialize({ context: null, cache: new InMemoryLRUCache() });
  dataSources.esiAuth.initialize({ context: null, cache: new InMemoryLRUCache() });

  return dataSources;
};
