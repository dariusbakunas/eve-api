import { IDataSources } from "./services";
import { ContextUser } from './auth/getUser';

export interface IResolverContext {
  dataSources: IDataSources;
  user: ContextUser;
}
