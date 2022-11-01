import { ApolloServer } from '@apollo/server';
import express, { NextFunction, Request, Response } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import cors from 'cors';
import { json } from 'body-parser';
import { loadSchema } from './schema/loadSchema';
import resolvers from './resolvers';
import { dataSources, IDataSources } from "./services";
import Pino from 'pino';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { auth, UnauthorizedError } from 'express-oauth2-jwt-bearer';
import { ContextUser, getUser } from './auth/getUser';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from './auth/permissions';

const typeDefs = loadSchema();

export interface ApolloContext {
  dataSources: IDataSources;
  user: ContextUser;
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const app = express();

  const checkJwt = auth({
    audience: 'https://eve-api',
    issuerBaseURL: `https://eve-app.auth0.com/`,
    jwksUri: "https://eve-app.auth0.com/.well-known/jwks.json",
  });

  const httpServer = http.createServer(app);
  const server = new ApolloServer<ApolloContext>({
    schema: applyMiddleware(schema, permissions),
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
        const ds = dataSources();
        const token = req.headers.authorization || '';
        const user = await getUser(ds.db, 'eve-app.auth0.com', token, req.auth?.payload.sub);

        return {
          dataSources: ds,
          user,
        };
      },
    }),
  );

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof UnauthorizedError) {
      console.log(err);
      res.status(err.statusCode).json({ message: err.message });
    } else {
      next(err);
    }
  });

  const port = process.env.PORT || 4000;

  await new Promise<void>((resolve) => httpServer.listen({ port: port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  return { server, app };
}

void startApolloServer();
