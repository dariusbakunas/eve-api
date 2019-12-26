import { IDataSources } from './services';
import { InvCategory } from './services/db/models/InvCategory';
import { InventoryItem } from './services/db/models/InventoryItem';
import { InvGroup } from './services/db/models/invGroup';
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

export type InvItemPartial = Pick<InventoryItem, 'typeID' | 'typeName' | 'groupID' | 'groupName' | 'categoryID'>;
export type InvGroupPartial = Pick<InvGroup, 'groupID' | 'groupName' | 'categoryID'>;
export type InvCategoryPartial = Pick<InvCategory, 'categoryID' | 'categoryName'>;
