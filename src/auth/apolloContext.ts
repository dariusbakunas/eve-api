import { ApolloContext, ContextUser } from '../types';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import Cache from 'node-cache';
import db from '../services/db/index';
import request from '../utils/request';
//import * as Sentry from '@sentry/node';
import { applicationConfig } from '../utils/applicationConfig';
import logger from '../utils/logger';
import mockUser from './userMock';

const cache = new Cache({
  stdTTL: 100,
  checkperiod: 120,
  useClones: true,
  deleteOnExpire: true,
});

type ContextParams = ExpressContext & {
  req: {
    user: {
      sub: string;
    };
  };
};

export interface IAuthUser {
  email: string;
  email_verified: boolean;
}

const apolloContext: ContextFunction<ContextParams, ApolloContext> = async ({ req }) => {
  const { config } = applicationConfig;
  if (process.env.USE_TEST_USER === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const user: ContextUser = mockUser;
    return {
      user,
    };
  }

  const token: string | undefined = req.headers.authorization;
  const { sub } = req.user;

  let user = cache.get<ContextUser>(sub);

  const headers: { [key: string]: string } = token
    ? {
        Authorization: token,
      }
    : {};

  if (!user) {
    try {
      // get user information
      const { data: authUser } = await request<IAuthUser>(`https://${config.auth0Domain}/userinfo`, {
        headers,
      });

      const { email, email_verified: emailVerified } = authUser;

      if (!emailVerified) {
        user = {
          email,
          status: 'NOT_VERIFIED',
        };

        return { user };
      }

      const dbUser = await db.User.query().findOne({
        email,
      });

      if (!dbUser) {
        user = {
          email,
          status: 'GUEST',
        };

        return { user };
      }

      user = {
        id: `${dbUser.id}`,
        email,
        status: dbUser.status,
      };

      cache.set(sub, user);
      return { user };
    } catch (e) {
      logger.error(e.message);
      return {};
    }
  }

  return { user };
};

export default apolloContext;
