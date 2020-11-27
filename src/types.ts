import { IDataSources } from './services';
import { InvCategory } from './services/db/models/InvCategory';
import { InventoryItem } from './services/db/models/InventoryItem';
import { InvGroup } from './services/db/models/invGroup';
import { IUserProfile } from './index';
import { Resolver, ResolversTypes } from './__generated__/types';
import { WarehouseItem } from './services/db/models/warehouseItem';
import { IndustryJob } from './services/db/models/industryJob';

export type Maybe<T> = T | null;

export interface IResolverContext {
  dataSources: IDataSources;
  user: ContextUser;
}

export interface ContextUser {
  id: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GUEST' | 'NOT_VERIFIED';
}

export interface ApolloContext {
  user?: ContextUser;
}

type ResolverReturnType<Type> = Type extends keyof ResolversTypes ? ResolversTypes[Type] : Type extends object ? Type : never;
type TypeBase = keyof ResolversTypes | object;

export type MaybeResolver<Type extends TypeBase, Parent, Context = unknown, Args = unknown> = Resolver<
  Maybe<ResolverReturnType<Type>>,
  Parent,
  Context,
  Args
>;

export type MaybeArrayResolver<Type extends TypeBase, Parent, Context = unknown, Args = unknown> = Resolver<
  Maybe<Array<ResolverReturnType<Type>>>,
  Parent,
  Context,
  Args
>;

export type InvItemPartial = Pick<InventoryItem, 'typeID' | 'typeName' | 'groupID' | 'groupName' | 'categoryID' | 'mass' | 'volume'>;
export type InvGroupPartial = Pick<InvGroup, 'groupID' | 'groupName' | 'categoryID'>;
export type InvCategoryPartial = Pick<InvCategory, 'categoryID' | 'categoryName'>;
export type WarehouseItemPartial = Pick<WarehouseItem, 'warehouseId' | 'typeId' | 'unitPrice' | 'quantity'>;
export type IndustryJobPartial = Pick<IndustryJob, 'id' | 'activityId' | 'blueprintId' | 'blueprintLocationId' | 'productTypeId'>;
