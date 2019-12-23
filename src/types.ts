import { IDataSources } from './services';
import { InventoryItem } from './services/db/models/InventoryItem';
import { IUserProfile } from './index';

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

export type InvItemPartial = Pick<InventoryItem, 'typeID' | 'typeName' | 'groupID' | 'groupName'>;
