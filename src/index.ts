import express from 'express';
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { loadSchema } from "./schema/loadSchema";
import resolvers from "./resolvers";
import jwt from "express-jwt";
import jwks from "jwks-rsa";
import request from "./utils/request";

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

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

const app = express();

app.use(jwtCheck);

const typeDefs = loadSchema();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: true,
  },
});

const server = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization;

    // get user information
    const user: IUserProfile = await request(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: token,
      }
    });

    return {
      user,
    }
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
