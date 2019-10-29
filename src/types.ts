import { IDataSources, IUserProfile } from './index';

export type Maybe<T> = T | null;

export interface IResolverContext {
  dataSources: IDataSources;
  user: IUserProfile;
}

export interface ContextUser {
  id?: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GUEST';
}

export interface ApolloContext {
  user?: ContextUser;
}
