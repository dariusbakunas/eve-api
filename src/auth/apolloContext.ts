import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { ApolloContext, ContextUser } from '../types';
import Cache from 'node-cache';
import request from '../utils/request';
import db from '../services/db/index';
//import * as Sentry from '@sentry/node';
import mockUser from './userMock';
import logger from '../utils/logger';

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

interface IAuthUser {
  email: string;
  email_verified: boolean;
}

const apolloContext: ContextFunction<ContextParams, ApolloContext> = async ({ req }) => {
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
      const authUser = await request<IAuthUser>(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
        headers,
      });

      const { email, email_verified: emailVerified } = authUser;

      // Sentry.configureScope(scope => {
      //   scope.setUser({ email });
      // });

      if (!emailVerified) {
        return {};
      }

      const dbUser = await db.User.query().findOne({
        email,
      });

      user = {
        email,
        status: 'GUEST',
      };

      if (!dbUser) {
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