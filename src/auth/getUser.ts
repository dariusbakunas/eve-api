import Cache from 'node-cache';
import axios from 'axios';
import { IDataSources } from '../services';

const cache = new Cache({
  stdTTL: 100,
  checkperiod: 120,
  useClones: true,
  deleteOnExpire: true,
});

export interface ContextUser {
  id: number;
  email: string;
  username: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GUEST' | 'NOT_VERIFIED';
}

interface UserResponse {
  email: string;
  email_verified: boolean;
  sub: string;
  name: string;
  nickname: string;
}

export const getUser = async (db: IDataSources["db"], auth0domain: string, token: string, sub?: string) => {
  const options = {
    method: 'GET',
    url: `${auth0domain}/userinfo`,
    headers: {authorization: token}
  };

  // caching is only used to reduce auth0 calls
  let user = sub ? cache.get<ContextUser>(sub): null;

  if (user) {
    // to refresh user status quicker, fetch it from db
    let dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })

    // unlikely? but if user is cached and removed from db afterwards, re-create it
    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          email: user.email,
          username: user.username,
          status: 'INACTIVE'
        },
      })
    }

    return {
      ...user,
      status: dbUser.status,
    };
  }

  try {
    const { data: { sub, email, email_verified: emailVerified, nickname } } = await axios.request<UserResponse>(options);

    if (!emailVerified) {
      user = {
        id: -1,
        email,
        username: nickname,
        status: 'NOT_VERIFIED',
      };

      return user;
    }

    let dbUser = await db.user.findUnique({
      where: {
        email,
      }
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          email,
          username: nickname,
          status: 'INACTIVE'
        },
      })
    }

    user = {
      id: dbUser.id,
      email,
      username: dbUser.username,
      status: dbUser.status,
    };

    cache.set<ContextUser>(sub, user);
    return user;
  } catch(e) {
    console.error(e);
    throw e;
  }
}