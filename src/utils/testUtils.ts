import Mock = jest.Mock;
import FunctionPropertyNames = jest.FunctionPropertyNames;
import { Character } from '../services/db/models/character';
import { User } from '../services/db/models/user';

export class QueryMock {
  public deleteByIdFn: Mock;
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
    this.deleteByIdFn = jest.fn();
    this.findByIdFn = jest.fn();
    this.orderByFn = jest.fn();
    this.whereFn = jest.fn();
  }

  findById = (...args: any[]) => {
    const ret = this.findByIdFn(...args);
    return ret ? Promise.resolve(ret) : this;
  };

  deleteById = (...args: any[]) => {
    const ret = this.deleteByIdFn(...args);
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
        getCharacterTokens: jest.fn().mockReturnValue({
          // eslint-disable-next-line @typescript-eslint/camelcase
          access_token: 'TEST_ACCESS_TOKEN',
          // eslint-disable-next-line @typescript-eslint/camelcase
          refresh_token: 'TEST_REFRESH_TOKEN',
          // eslint-disable-next-line @typescript-eslint/camelcase
          expires_in: 5000,
        }),
        getAccessToken: jest.fn(),
        verifyToken: jest.fn().mockReturnValue({
          CharacterID: 'TEST_CHARACTER_ID',
          CharacterName: 'TEST_CHARACTER_NAME',
          Scopes: 'scope01 scope02 scope03',
        }),
      },
      esiApi: {
        getCharacterInfo: jest.fn(),
      },
    },
    user: {
      id: userId,
    },
  };
};
