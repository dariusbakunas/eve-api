import { ApolloServer, GraphQLRequestContext, GraphQLRequestListener } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadSchema } from './schema/loadSchema';
import resolvers from './resolvers';
import { dataSources, IDataSources } from "./services";
import Pino from 'pino';
import { GraphQLRequestContextDidEncounterErrors } from '@apollo/server/src/externalTypes/requestPipeline';

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
    plugins: [
      {
        requestDidStart(ctx: GraphQLRequestContext<ContextValue>): Promise<GraphQLRequestListener<ContextValue> | void> {


          return Promise.resolve({
            async didEncounterErrors({ errors }: GraphQLRequestContextDidEncounterErrors<ContextValue>) {
              errors.forEach((error) => logger.warn(error));
            },
          });
        }
      }
    ]
  });

  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      return {
        dataSources: dataSources(),
      };
    },
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at ${url}`);
}

void startApolloServer();
