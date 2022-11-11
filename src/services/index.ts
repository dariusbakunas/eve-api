import { PrismaClient } from '@prisma/client'
import EsiAPI from './esi/api';
import EsiAuth from './esi/auth';
import Crypt from './esi/crypt';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

export interface IDataSources {
  db: PrismaClient,
  esiApi: EsiAPI,
  esiAuth: EsiAuth,
  crypt: Crypt,
}

export const dataSources = (options: { dbURL: string, eveEsiURL: string, eveLoginURL: string, clientID: string, clientSecret: string, cryptSecret: string, cache: KeyValueCache }) => {
  const dataSources: IDataSources = {
    db: new PrismaClient({
      datasources: {
        db: {
          url: options.dbURL,
        }
      }
    }),
    esiApi: new EsiAPI(options.eveEsiURL, { cache: options.cache }),
    esiAuth: new EsiAuth(options.eveLoginURL, options.clientID, options.clientSecret, { cache: options.cache }),
    crypt: new Crypt(options.cryptSecret),
  };

  return dataSources;
}
