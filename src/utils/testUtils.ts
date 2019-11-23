import Mock = jest.Mock;
import FunctionPropertyNames = jest.FunctionPropertyNames;
import { Character } from '../services/db/models/character';
import { User } from '../services/db/models/user';

export class QueryMock {
  public findByIdFn: Mock;
  public whereFn: Mock;
  public orderByFn: Mock;

  static spyOn = <T extends {}, M extends FunctionPropertyNames<Required<T>>>(object: T, method: M) => {
    const querySpy = jest.spyOn<T, M>(object, method);
    const queryMock = new QueryMock();
    querySpy.mockReturnValue(queryMock as any);
    return queryMock;
  };

  constructor() {
    this.findByIdFn = jest.fn();
    this.orderByFn = jest.fn();
    this.whereFn = jest.fn();
  }

  findById = (...args: any[]) => {
    const ret = this.findByIdFn(...args);
    return ret ? Promise.resolve(ret) : this;
  };

  where = (...args: any[]) => {
    const ret = this.whereFn(...args);
    return ret ? Promise.resolve(ret) : this;
  };

  orderBy = (...args: any[]) => {
    const ret = this.orderByFn(args);
    return ret ? Promise.resolve(ret) : this;
  };
}

export const getTestContext = (userId: number) => {
  return {
    dataSources: {
      crypt: {
        encrypt: (content: string) => content + '_encrypted', // encryption is irrelevant here
      },
      db: {
        Character,
        User,
      },
      esiAuth: {
        getCharacterTokens: jest.fn(),
        getAccessToken: jest.fn(),
        verifyToken: jest.fn(),
      },
    },
    user: {
      id: userId,
    },
  };
};
