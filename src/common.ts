import type { IDataSources } from "./services";
import type { ContextUser } from './auth/getUser';

export interface IResolverContext {
  dataSources: IDataSources;
  user: ContextUser;
}
