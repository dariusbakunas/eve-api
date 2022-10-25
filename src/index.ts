import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadSchema } from './schema/loadSchema';
import resolvers from './resolvers';
import { dataSources, IDataSources } from "./services";
import Pino from 'pino';

const typeDefs = loadSchema();

interface ContextValue {
  dataSources: IDataSources;
}

async function startApolloServer() {
  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    includeStacktraceInErrorResponses: true,
    logger: Pino().child({}),
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      return {
        dataSources: dataSources(),
      };
    },
    listen: { port: process.env.PORT ? +process.env.PORT : 4000 },
  });

  console.log(`🚀  Server ready at ${url}`);
}

void startApolloServer();
