import { ApolloServer } from '@apollo/server';
import express, { NextFunction, Request, Response } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { loadSchema } from './schema/loadSchema';
import resolvers from './resolvers';
import Pino from 'pino';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { auth, UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './auth/permissions';
import config from './config'
import { context, IResolverContext } from './services/context';

const typeDefs = loadSchema();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const auth0domain = config.get('auth0domain');
const apiAudience = config.get('apiAudience');

async function startApolloServer() {
  const app = express();

  const checkJwt = auth({
    audience: apiAudience,
    issuerBaseURL: `${auth0domain}`,
    jwksUri: `${auth0domain}/.well-known/jwks.json`,
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer<IResolverContext>({
    schema: config.get('introspection') === 'true' ? schema : applyMiddleware(schema, permissions),
    csrfPrevention: true,
    includeStacktraceInErrorResponses: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    logger: Pino().child({}),
  });

  await server.start();

  app.use(
    '/graphql',
    checkJwt,
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { cache } = server;
        return context(req, cache);
      },
    }),
  );

  app.use((err: unknown, _: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
      console.log(err);
      res.status(err.statusCode).json({ message: err.message });
    } else {
      next(err);
    }
  });

  const port = config.get('port');

  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  return { server, app };
}

void startApolloServer();
