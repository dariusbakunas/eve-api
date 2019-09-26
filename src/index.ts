import express, { Request } from 'express';
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { loadSchema } from "./schema/loadSchema";
import resolvers from "./resolvers";
import request from "./utils/request";
import Cache from "node-cache";
import db from "./db/index";
import jwtMiddleware from "./auth/jwtMiddleware";

const cache = new Cache({ stdTTL: 100, checkperiod: 120, useClones: true, deleteOnExpire: true });

interface IUserProfile {
 sub: string,
 nickname: string,
 name: string,
 picture: string,
 updated_at: string,
 email: string,
 email_verified: boolean,
}

if (!process.env.AUTH0_AUDIENCE) {
  throw new Error("process.env.AUTH0_AUDIENCE is required");
}

if (!process.env.AUTH0_DOMAIN) {
  throw new Error("process.env.AUTH0_DOMAIN is required");
}

const app = express();

if (process.env.NODE_ENV !== "development" && process.env.USE_TEST_USER !== "true") {
  app.use(jwtMiddleware);
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
  context: async ({ req }: { req: Request & { user?: { sub: string } } }) => {
    if (process.env.USE_TEST_USER === "true") {
      const user = require("./auth/userMock");
      return {
        user
      };
    }

    const token = req.headers.authorization;

    if (!req.user) {
      return;
    }

    const { sub } = req.user;

    let user: IUserProfile = cache.get(sub);

    if (!user) {
      // get user information
      user = await request(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: token,
        }
      });

      cache.set(sub, user);
    }

    return {
      user,
    }
  },
  dataSources: () => {
    return {
      db,
    };
  },
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
