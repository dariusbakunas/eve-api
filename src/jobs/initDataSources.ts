import { InMemoryLRUCache } from 'apollo-server-caching';
import { Model } from 'objection';
import Crypt from '../services/crypt';
import db from '../services/db';
import EsiAPI from '../services/esi/api';
import EsiAuth from '../services/esi/auth';
import Knex from 'knex';

export const initDataSources = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dbConfig = require('../knexfile');
  const knex = Knex(dbConfig[process.env.NODE_ENV!]);
  Model.knex(knex);

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
