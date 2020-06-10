import * as Sentry from '@sentry/node';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { dataSources } from './services';
import { Firestore } from '@google-cloud/firestore';
import { loadSchema } from './schema/loadSchema';
import { Model } from 'objection';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import apolloContext from './auth/apolloContext';
import express, { Request, Response } from 'express';
import getJwtMiddleware from './auth/jwtMiddleware';
import helmet from 'helmet';
import logger from './utils/logger';
import morgan from 'morgan';
import pJson from '../package.json';
import resolvers from './resolvers';
import shieldMiddleware from './auth/shieldMiddleware';
import Knex = require('knex');

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: `${pJson.name}@${pJson.version}`,
  });
}

export interface IUserProfile {
  id: number;
  sub: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
}

(async function() {
  if (process.env.APP_ENGINE === 'true') {
    const secretClient = new SecretManagerServiceClient();
    const projectId = secretClient.getProjectId();

    const [dbPswPayload] = await secretClient.accessSecretVersion({
      name: `projects/${projectId}/secrets/EVE_DB_PSW/versions/latest`,
    });

    process.env['PD_DB_PASSWORD'] = dbPswPayload?.payload?.data?.toString();

    require('@google-cloud/debug-agent').start();
    const firestore = new Firestore();
    const ref = firestore.collection('configs').doc('eve-mate-api');
    const doc = await ref.get();

    if (!doc.exists) {
      throw new Error('Unable to load app engine configs');
    } else {
      const configs = doc.data();

      if (configs) {
        Object.keys(configs).forEach(key => {
          process.env[key] = configs[key];
        });
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const dbConfig = require('../knexfile');
  const knex = Knex(dbConfig[process.env.NODE_ENV!]);
  Model.knex(knex);

  const requiredEnv = ['AUTH0_AUDIENCE', 'AUTH0_DOMAIN', 'EVE_LOGIN_URL', 'EVE_ESI_URL', 'TOKEN_SECRET', 'EVE_CLIENT_ID', 'EVE_CLIENT_SECRET'];

  requiredEnv.forEach(env => {
    if (!process.env[env]) {
      throw new Error(`process.env.${env} is required`);
    }
  });

  const app = express();
  app.use(helmet());
  app.use(Sentry.Handlers.requestHandler());

  app.use(
    morgan('short', {
      skip: (req: Request, res: Response) => {
        return (
          req.url === '/.well-known/apollo/server-health' ||
          req.url === '/favicon.ico' ||
          req.originalUrl === '/.well-known/apollo/server-health' ||
          req.originalUrl === '/favicon.ico' ||
          res.statusCode < 400
        );
      },
      stream: process.stderr,
    })
  );

  app.use(
    morgan('short', {
      skip: (req: Request, res: Response) => {
        return (
          req.url === '/.well-known/apollo/server-health' ||
          req.url === '/favicon.ico' ||
          req.originalUrl === '/.well-known/apollo/server-health' ||
          req.originalUrl === '/favicon.ico' ||
          res.statusCode >= 400
        );
      },
      stream: process.stdout,
    })
  );

  if (process.env.NODE_ENV === 'production' || (process.env.NODE_ENV === 'development' && process.env.USE_TEST_USER !== 'true')) {
    app.use('/graphql*', getJwtMiddleware(process.env.AUTH0_DOMAIN!, process.env.AUTH0_AUDIENCE!));
  } else {
    logger.warn('Token authentication is disabled!!!');
  }

  const typeDefs = loadSchema();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions: {
      requireResolversForResolveType: true,
    },
  });

  const server = new ApolloServer({
    context: apolloContext,
    dataSources,
    formatError: err => {
      // Don't give the specific errors to the client.
      Sentry.captureException(err);
      logger.error(err.message);

      // Otherwise return the original error.  The error can also
      // be manipulated in other ways, so long as it's returned.
      return err;
    },
    schema: applyMiddleware(schema, shieldMiddleware),
  });

  app.get('/health-check', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Status: OK!');
  });

  server.applyMiddleware({ app });

  app.use(Sentry.Handlers.errorHandler());

  const port = process.env.PORT || 4000;

  app.listen({ port }, () => logger.info(`🚀 Server ready at http://localhost:${port}/graphql`));
})();
