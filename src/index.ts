import { ApolloServer } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import Fastify, { FastifyInstance } from 'fastify'
import { loadSchema } from './schema/loadSchema';
import resolvers from './resolvers';
import {PrismaClient} from "prisma/prisma-client/scripts/default-index";
import { dataSources } from "./services";

const fastifyServer: FastifyInstance = Fastify({
  logger: {
    prettyPrint:
      process.env.NODE_ENV === 'development'
        ? {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
        : false
  }
})

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      fastifyAppClosePlugin(fastifyServer),
      ApolloServerPluginDrainHttpServer({ httpServer: fastifyServer.server }),
    ],
    dataSources: () => dataSources(),
  });

  await server.start();
  fastifyServer.register(server.createHandler());
  await fastifyServer.listen(3000);
}

const typeDefs = loadSchema();

void startApolloServer(typeDefs, resolvers);
