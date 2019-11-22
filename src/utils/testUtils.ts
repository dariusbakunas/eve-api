import Mock = jest.Mock;
import FunctionPropertyNames = jest.FunctionPropertyNames;

export class QueryMock {
  public whereFn: Mock;
  public orderByFn: Mock;

  static spyOn = <T extends {}, M extends FunctionPropertyNames<Required<T>>>(object: T, method: M) => {
    const querySpy = jest.spyOn<T, M>(object, method);
    const queryMock = new QueryMock();
    querySpy.mockReturnValue(queryMock as any);
    return queryMock;
  };

  constructor() {
    this.orderByFn = jest.fn();
    this.whereFn = jest.fn();
  }

  where = (...args: any[]) => {
    const ret = this.whereFn(...args);
    return ret ? Promise.resolve(ret) : this;
  };

  orderBy = (...args: any[]) => {
    const ret = this.orderByFn(args);
    return ret ? Promise.resolve(ret) : this;
  };
}
