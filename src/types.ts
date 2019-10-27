import { IDataSources, IUserProfile } from './index';

export type Maybe<T> = T | null;

export interface IResolverContext {
  dataSources: IDataSources;
  user: IUserProfile;
}
