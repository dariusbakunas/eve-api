import * as Sentry from '@sentry/node';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applicationConfig } from './utils/applicationConfig';
import { applyMiddleware } from 'graphql-middleware';
import { dataSources } from './services';
import { loadKnexConfig } from '../loadKnexConfig';
import { loadSchema } from './schema/loadSchema';
import { Model } from 'objection';
import apolloContext from './auth/apolloContext';
import express, { Request, Response } from 'express';
import getJwtMiddleware from './auth/jwtMiddleware';
import helmet from 'helmet';
import logger from './utils/logger';
import morgan from 'morgan';
import pJson from '../package.json';
import resolvers from './resolvers';
import shieldMiddleware from './auth/shieldMiddleware';

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
  try {
    await applicationConfig.load();
    const dbConfig = loadKnexConfig(applicationConfig.config);
    // @ts-ignore
    Model.knex(dbConfig);
  } catch (e) {
    logger.error(e);
  }

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
