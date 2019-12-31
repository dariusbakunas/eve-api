import jwks from 'jwks-rsa';
import jwt from 'express-jwt';

const getJwtMiddleware = (auth0Domain: string, auth0Audience: string) => {
  return jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
    }),
    audience: auth0Audience,
    issuer: `https://${auth0Domain}/`,
    algorithms: ['RS256'],
  });
};

export default getJwtMiddleware;
