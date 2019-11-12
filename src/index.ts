import express, { Request, Response } from 'express';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from 'graphql-middleware';
import { RedisCache } from 'apollo-server-cache-redis';
import { loadSchema } from './schema/loadSchema';
import resolvers from './resolvers';
import logger from './utils/logger';
import db from './services/db/index';
import jwtMiddleware from './auth/jwtMiddleware';
import EsiAPI from './services/esi/api';
import EsiAuth from './services/esi/auth';
import Crypt from './services/crypt';
import { Character } from './services/db/models/character';
import { User } from './services/db/models/user';
import { Scope } from './services/db/models/scope';
import apolloContext from './auth/apolloContext';
import shieldMiddleware from './auth/shieldMiddleware';
import * as Sentry from '@sentry/node';
import { Invitation } from './services/db/models/invitation';
import { WalletTransaction } from './services/db/models/walletTransaction';
import { JournalEntry } from './services/db/models/journalEntry';
import pJson from '../package.json';
import morgan from 'morgan';
import helmet from 'helmet';

Sentry.init({
  dsn: 'https://3df90faaa98c4caf84cd615965e4aa42@sentry.io/1816282',
  release: `${pJson.name}@${pJson.version}`,
});

const redisCache = new RedisCache({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

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

export interface IDataSources {
  db: {
    Character: typeof Character;
    JournalEntry: typeof JournalEntry;
    User: typeof User;
    Scope: typeof Scope;
    Invitation: typeof Invitation;
    WalletTransaction: typeof WalletTransaction;
  };
  esiAuth: EsiAuth;
  esiApi: EsiAPI;
  crypt: Crypt;
  [key: string]: object;
}

const requiredEnv = [
  'AUTH0_AUDIENCE',
  'AUTH0_DOMAIN',
  'EVE_LOGIN_URL',
  'EVE_ESI_URL',
  'TOKEN_SECRET',
  'EVE_CLIENT_ID',
  'EVE_CLIENT_SECRET',
];

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

if (
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV === 'development' && process.env.USE_TEST_USER !== 'true')
) {
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

const dataSources: () => IDataSources = () => ({
  db,
  esiAuth: new EsiAuth(process.env.EVE_LOGIN_URL!),
  esiApi: new EsiAPI(process.env.EVE_ESI_URL!, redisCache),
  crypt: new Crypt(process.env.TOKEN_SECRET!),
});

const server = new ApolloServer({
  context: apolloContext,
  cache: new RedisCache({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
  }),
  dataSources,
  schema: applyMiddleware(schema, shieldMiddleware),
});

app.get('/health-check', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Status: OK!');
});

server.applyMiddleware({ app });

app.use(Sentry.Handlers.errorHandler());

app.listen({ port: 4000 }, () => logger.info(`🚀 Server ready at http://localhost:4000/graphql`));
