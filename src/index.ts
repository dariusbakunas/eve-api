import express from 'express';
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { loadSchema } from "./schema/loadSchema";
import resolvers from "./resolvers";

const app = express();

const typeDefs = loadSchema();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: true,
  },
});

const server = new ApolloServer({
  schema,
});

app.get('/health-check', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Status: OK!');
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000/graphql`)
);
