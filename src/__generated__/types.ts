import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  DateTime: any,
  Date: any,
  Time: any,
};

export type Alliance = {
   __typename?: 'Alliance',
  id: Scalars['ID'],
  name: Scalars['String'],
  ticker: Scalars['String'],
};

export type Character = {
   __typename?: 'Character',
  id: Scalars['ID'],
  corporation: Corporation,
  name: Scalars['String'],
  gender: Scalars['String'],
  scopes?: Maybe<Array<Scalars['String']>>,
  birthday: Scalars['DateTime'],
  securityStatus: Scalars['Float'],
  totalSp?: Maybe<Scalars['Int']>,
};

export type Client = {
   __typename?: 'Client',
  id: Scalars['ID'],
  name: Scalars['String'],
  category: Scalars['String'],
};

export type Corporation = {
   __typename?: 'Corporation',
  id: Scalars['ID'],
  alliance?: Maybe<Alliance>,
  dateFounded?: Maybe<Scalars['DateTime']>,
  name: Scalars['String'],
  memberCount: Scalars['Int'],
  taxRate: Scalars['Float'],
  ticker: Scalars['String'],
};



export type InventoryItem = {
   __typename?: 'InventoryItem',
  id: Scalars['ID'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
};

export type JournalEntries = {
   __typename?: 'JournalEntries',
  total: Scalars['Int'],
  entries: Array<JournalEntry>,
};

export type JournalEntry = {
   __typename?: 'JournalEntry',
  id: Scalars['ID'],
  amount: Scalars['Float'],
  balance: Scalars['Float'],
  character?: Maybe<Character>,
  date: Scalars['DateTime'],
  description?: Maybe<Scalars['String']>,
};

export type Location = {
   __typename?: 'Location',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  addCharacter: Character,
  updateCharacter: Character,
  removeCharacter: Scalars['ID'],
  register: User,
};


export type MutationAddCharacterArgs = {
  code: Scalars['String']
};


export type MutationUpdateCharacterArgs = {
  id: Scalars['ID'],
  code: Scalars['String']
};


export type MutationRemoveCharacterArgs = {
  id: Scalars['ID']
};


export type MutationRegisterArgs = {
  input: RegistrationInput
};

export enum Order {
  Asc = 'asc',
  Desc = 'desc'
}

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell'
}

export type PageInput = {
  index?: Maybe<Scalars['Int']>,
  size?: Maybe<Scalars['Int']>,
};

export type Query = {
   __typename?: 'Query',
  characters: Array<Character>,
  scopes: Array<Scope>,
  userByEmail?: Maybe<User>,
  walletJournal?: Maybe<JournalEntries>,
  walletTransactions?: Maybe<WalletTransactions>,
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']
};


export type QueryWalletJournalArgs = {
  page?: Maybe<PageInput>,
  orderBy?: Maybe<WalletJournalOrderByInput>
};


export type QueryWalletTransactionsArgs = {
  page?: Maybe<PageInput>,
  filter?: Maybe<WalletTransactionFilter>,
  orderBy?: Maybe<WalletTransactionOrderByInput>
};

export type RegistrationInput = {
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  username: Scalars['String'],
  email: Scalars['String'],
  code: Scalars['String'],
};

export type Scope = {
   __typename?: 'Scope',
  id: Scalars['ID'],
  name: Scalars['String'],
};


export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  username: Scalars['String'],
  firstName?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  email: Scalars['String'],
  status: UserStatus,
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

export enum WalletJournalOrderBy {
  Date = 'date',
  Amount = 'amount',
  Character = 'character',
  Balance = 'balance',
  Description = 'description'
}

export type WalletJournalOrderByInput = {
  column: WalletJournalOrderBy,
  order: Order,
};

export type WalletTransaction = {
   __typename?: 'WalletTransaction',
  id: Scalars['ID'],
  credit: Scalars['Float'],
  client: Client,
  character?: Maybe<Character>,
  date: Scalars['DateTime'],
  isBuy: Scalars['Boolean'],
  item?: Maybe<InventoryItem>,
  location: Location,
  quantity: Scalars['Int'],
  unitPrice: Scalars['Float'],
};

export type WalletTransactionFilter = {
  item?: Maybe<Scalars['String']>,
  characterId?: Maybe<Scalars['ID']>,
  orderType?: Maybe<OrderType>,
};

export enum WalletTransactionOrderBy {
  Date = 'date',
  Client = 'client',
  Character = 'character',
  Credit = 'credit',
  Item = 'item',
  Quantity = 'quantity',
  Station = 'station',
  UnitPrice = 'unitPrice'
}

export type WalletTransactionOrderByInput = {
  column: WalletTransactionOrderBy,
  order: Order,
};

export type WalletTransactions = {
   __typename?: 'WalletTransactions',
  total: Scalars['Int'],
  transactions: Array<WalletTransaction>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  Character: ResolverTypeWrapper<Partial<Character>>,
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>,
  Corporation: ResolverTypeWrapper<Partial<Corporation>>,
  Alliance: ResolverTypeWrapper<Partial<Alliance>>,
  String: ResolverTypeWrapper<Partial<Scalars['String']>>,
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']>>,
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>,
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>,
  Scope: ResolverTypeWrapper<Partial<Scope>>,
  User: ResolverTypeWrapper<Partial<User>>,
  UserStatus: ResolverTypeWrapper<Partial<UserStatus>>,
  PageInput: ResolverTypeWrapper<Partial<PageInput>>,
  WalletJournalOrderByInput: ResolverTypeWrapper<Partial<WalletJournalOrderByInput>>,
  WalletJournalOrderBy: ResolverTypeWrapper<Partial<WalletJournalOrderBy>>,
  Order: ResolverTypeWrapper<Partial<Order>>,
  JournalEntries: ResolverTypeWrapper<Partial<JournalEntries>>,
  JournalEntry: ResolverTypeWrapper<Partial<JournalEntry>>,
  WalletTransactionFilter: ResolverTypeWrapper<Partial<WalletTransactionFilter>>,
  OrderType: ResolverTypeWrapper<Partial<OrderType>>,
  WalletTransactionOrderByInput: ResolverTypeWrapper<Partial<WalletTransactionOrderByInput>>,
  WalletTransactionOrderBy: ResolverTypeWrapper<Partial<WalletTransactionOrderBy>>,
  WalletTransactions: ResolverTypeWrapper<Partial<WalletTransactions>>,
  WalletTransaction: ResolverTypeWrapper<Partial<WalletTransaction>>,
  Client: ResolverTypeWrapper<Partial<Client>>,
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>,
  InventoryItem: ResolverTypeWrapper<Partial<InventoryItem>>,
  Location: ResolverTypeWrapper<Partial<Location>>,
  Mutation: ResolverTypeWrapper<{}>,
  RegistrationInput: ResolverTypeWrapper<Partial<RegistrationInput>>,
  Date: ResolverTypeWrapper<Partial<Scalars['Date']>>,
  Time: ResolverTypeWrapper<Partial<Scalars['Time']>>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  Character: Partial<Character>,
  ID: Partial<Scalars['ID']>,
  Corporation: Partial<Corporation>,
  Alliance: Partial<Alliance>,
  String: Partial<Scalars['String']>,
  DateTime: Partial<Scalars['DateTime']>,
  Int: Partial<Scalars['Int']>,
  Float: Partial<Scalars['Float']>,
  Scope: Partial<Scope>,
  User: Partial<User>,
  UserStatus: Partial<UserStatus>,
  PageInput: Partial<PageInput>,
  WalletJournalOrderByInput: Partial<WalletJournalOrderByInput>,
  WalletJournalOrderBy: Partial<WalletJournalOrderBy>,
  Order: Partial<Order>,
  JournalEntries: Partial<JournalEntries>,
  JournalEntry: Partial<JournalEntry>,
  WalletTransactionFilter: Partial<WalletTransactionFilter>,
  OrderType: Partial<OrderType>,
  WalletTransactionOrderByInput: Partial<WalletTransactionOrderByInput>,
  WalletTransactionOrderBy: Partial<WalletTransactionOrderBy>,
  WalletTransactions: Partial<WalletTransactions>,
  WalletTransaction: Partial<WalletTransaction>,
  Client: Partial<Client>,
  Boolean: Partial<Scalars['Boolean']>,
  InventoryItem: Partial<InventoryItem>,
  Location: Partial<Location>,
  Mutation: {},
  RegistrationInput: Partial<RegistrationInput>,
  Date: Partial<Scalars['Date']>,
  Time: Partial<Scalars['Time']>,
};

export type AllianceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Alliance'] = ResolversParentTypes['Alliance']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  ticker?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type CharacterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Character'] = ResolversParentTypes['Character']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  corporation?: Resolver<ResolversTypes['Corporation'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  scopes?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>,
  birthday?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  securityStatus?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  totalSp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type CorporationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Corporation'] = ResolversParentTypes['Corporation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  alliance?: Resolver<Maybe<ResolversTypes['Alliance']>, ParentType, ContextType>,
  dateFounded?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  memberCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  ticker?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export type InventoryItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['InventoryItem'] = ResolversParentTypes['InventoryItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type JournalEntriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalEntries'] = ResolversParentTypes['JournalEntries']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  entries?: Resolver<Array<ResolversTypes['JournalEntry']>, ParentType, ContextType>,
};

export type JournalEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalEntry'] = ResolversParentTypes['JournalEntry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  character?: Resolver<Maybe<ResolversTypes['Character']>, ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCharacter?: Resolver<ResolversTypes['Character'], ParentType, ContextType, RequireFields<MutationAddCharacterArgs, 'code'>>,
  updateCharacter?: Resolver<ResolversTypes['Character'], ParentType, ContextType, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>,
  removeCharacter?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationRemoveCharacterArgs, 'id'>>,
  register?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  characters?: Resolver<Array<ResolversTypes['Character']>, ParentType, ContextType>,
  scopes?: Resolver<Array<ResolversTypes['Scope']>, ParentType, ContextType>,
  userByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>,
  walletJournal?: Resolver<Maybe<ResolversTypes['JournalEntries']>, ParentType, ContextType, QueryWalletJournalArgs>,
  walletTransactions?: Resolver<Maybe<ResolversTypes['WalletTransactions']>, ParentType, ContextType, QueryWalletTransactionsArgs>,
};

export type ScopeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Scope'] = ResolversParentTypes['Scope']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time'
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>,
};

export type WalletTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransaction'] = ResolversParentTypes['WalletTransaction']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  credit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>,
  character?: Resolver<Maybe<ResolversTypes['Character']>, ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  isBuy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  item?: Resolver<Maybe<ResolversTypes['InventoryItem']>, ParentType, ContextType>,
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>,
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type WalletTransactionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactions'] = ResolversParentTypes['WalletTransactions']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  transactions?: Resolver<Array<ResolversTypes['WalletTransaction']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  Alliance?: AllianceResolvers<ContextType>,
  Character?: CharacterResolvers<ContextType>,
  Client?: ClientResolvers<ContextType>,
  Corporation?: CorporationResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  InventoryItem?: InventoryItemResolvers<ContextType>,
  JournalEntries?: JournalEntriesResolvers<ContextType>,
  JournalEntry?: JournalEntryResolvers<ContextType>,
  Location?: LocationResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Scope?: ScopeResolvers<ContextType>,
  Time?: GraphQLScalarType,
  User?: UserResolvers<ContextType>,
  WalletTransaction?: WalletTransactionResolvers<ContextType>,
  WalletTransactions?: WalletTransactionsResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
