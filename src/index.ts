import * as Sentry from '@sentry/node';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { dataSources } from './services';
import { loadSchema } from './schema/loadSchema';
import { RedisCache } from 'apollo-server-cache-redis';
import apolloContext from './auth/apolloContext';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import jwtMiddleware from './auth/jwtMiddleware';
import logger from './utils/logger';
import morgan from 'morgan';
import pJson from '../package.json';
import resolvers from './resolvers';
import shieldMiddleware from './auth/shieldMiddleware';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://3df90faaa98c4caf84cd615965e4aa42@sentry.io/1816282',
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
  app.use('/graphql*', jwtMiddleware);
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
  cache: new RedisCache({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  }),
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

app.listen({ port: 4000 }, () => logger.info(`🚀 Server ready at http://localhost:4000/graphql`));
