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
  skillGroups: Array<SkillGroup>,
  skillGroup?: Maybe<SkillGroup>,
  totalSp?: Maybe<Scalars['Int']>,
};


export type CharacterSkillGroupArgs = {
  id: Scalars['ID']
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

export type InvGroup = {
   __typename?: 'InvGroup',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type InvItem = {
   __typename?: 'InvItem',
  id: Scalars['ID'],
  name: Scalars['String'],
  invGroup: InvGroup,
};

export type InvItemFilter = {
  name?: Maybe<Scalars['String']>,
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
  character: Character,
  date: Scalars['DateTime'],
  description?: Maybe<Scalars['String']>,
};

export type Location = {
   __typename?: 'Location',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type MarketGroup = {
   __typename?: 'MarketGroup',
  id: Scalars['ID'],
  name: Scalars['String'],
};

export type MarketOrder = {
   __typename?: 'MarketOrder',
  id: Scalars['ID'],
  /** Character who issued the order */
  character: Character,
  /** Number of days for which order is valid (starting from the issued date). An order expires at time issued + duration */
  duration: Scalars['Int'],
  /** For buy orders, the amount of ISK in escrow */
  escrow?: Maybe<Scalars['Float']>,
  /** Item transacted in this order */
  item: InventoryItem,
  /** True if this is buy order */
  isBuy: Scalars['Boolean'],
  /** Signifies whether the buy/sell order was placed on behalf of a corporation */
  isCorporation: Scalars['Boolean'],
  /** Location where order was placed */
  location: Location,
  /** For buy orders, the minimum quantity that will be accepted in a matching sell order */
  minVolume?: Maybe<Scalars['Int']>,
  /** Date and time when this order was issued */
  issued: Scalars['DateTime'],
  /** Cost per unit for this order */
  price: Scalars['Float'],
  /** Valid order range, numbers are ranges in jumps */
  range: Scalars['String'],
  /** Quantity of items still required or offered */
  volumeRemain: Scalars['Int'],
  /** Quantity of items required or offered at time order was placed */
  volumeTotal: Scalars['Int'],
  /** Current order state */
  state: OrderState,
};

export type MarketOrderFilter = {
  characterId?: Maybe<Scalars['ID']>,
  state?: Maybe<OrderStateFilter>,
};

export enum MarketOrderOrderBy {
  Issued = 'issued'
}

export type MarketOrderOrderByInput = {
  column: MarketOrderOrderBy,
  order: Order,
};

export type MarketOrders = {
   __typename?: 'MarketOrders',
  total: Scalars['Int'],
  orders: Array<MarketOrder>,
};

export type Mutation = {
   __typename?: 'Mutation',
  addCharacter: Character,
  updateCharacter: Character,
  removeCharacter: Scalars['ID'],
  register: User,
  addItemsToWarehouse: Array<WarehouseItem>,
  updateItemsInWarehouse: Array<WarehouseItem>,
  removeItemsFromWarehouse: Array<Scalars['ID']>,
  addWarehouse: Warehouse,
  removeWarehouse: Scalars['ID'],
  updateWarehouse: Warehouse,
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


export type MutationAddItemsToWarehouseArgs = {
  id: Scalars['ID'],
  input: Array<WarehouseItemInput>
};


export type MutationUpdateItemsInWarehouseArgs = {
  id: Scalars['ID'],
  input: Array<WarehouseItemInput>
};


export type MutationRemoveItemsFromWarehouseArgs = {
  id: Scalars['ID'],
  itemIds: Array<Scalars['ID']>
};


export type MutationAddWarehouseArgs = {
  name: Scalars['String']
};


export type MutationRemoveWarehouseArgs = {
  id: Scalars['ID']
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID'],
  name: Scalars['String']
};

export enum Order {
  Asc = 'asc',
  Desc = 'desc'
}

export enum OrderState {
  Active = 'active',
  Cancelled = 'cancelled',
  Expired = 'expired'
}

export type OrderStateFilter = {
  active?: Maybe<Scalars['Boolean']>,
  expired?: Maybe<Scalars['Boolean']>,
  cancelled?: Maybe<Scalars['Boolean']>,
};

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell'
}

export type PageInput = {
  index?: Maybe<Scalars['Int']>,
  size?: Maybe<Scalars['Int']>,
};

export enum ProcessingCategory {
  WalletTransactions = 'WALLET_TRANSACTIONS',
  WalletJournal = 'WALLET_JOURNAL',
  Bookmarks = 'BOOKMARKS',
  MarketOrders = 'MARKET_ORDERS',
  Assets = 'ASSETS',
  Calendar = 'CALENDAR',
  Blueprints = 'BLUEPRINTS',
  Clones = 'CLONES',
  Implants = 'IMPLANTS',
  Contacts = 'CONTACTS',
  IndustryJobs = 'INDUSTRY_JOBS',
  Stats = 'STATS',
  Skills = 'SKILLS',
  SkillQueue = 'SKILL_QUEUE'
}

export type ProcessingLogEntry = {
   __typename?: 'ProcessingLogEntry',
  id: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  character?: Maybe<Character>,
  category: ProcessingCategory,
  status: ProcessingStatus,
  message: Scalars['String'],
  error?: Maybe<Scalars['String']>,
};

export type ProcessingLogFilter = {
  characterId?: Maybe<Scalars['ID']>,
};

export enum ProcessingStatus {
  Success = 'SUCCESS',
  Failure = 'FAILURE'
}

export type Query = {
   __typename?: 'Query',
  character?: Maybe<Character>,
  characters: Array<Character>,
  invItems: Array<InvItem>,
  processingLogs: Array<ProcessingLogEntry>,
  scopes: Array<Scope>,
  userByEmail?: Maybe<User>,
  marketOrders: MarketOrders,
  walletJournal: JournalEntries,
  walletTransactions: WalletTransactions,
  walletTransactionSummary: WalletTransactionSummary,
  walletTransactionIds: Array<Scalars['ID']>,
  warehouse?: Maybe<Warehouse>,
  warehouses: Array<Warehouse>,
};


export type QueryCharacterArgs = {
  id: Scalars['ID']
};


export type QueryInvItemsArgs = {
  filter?: Maybe<InvItemFilter>
};


export type QueryProcessingLogsArgs = {
  filter?: Maybe<ProcessingLogFilter>
};


export type QueryUserByEmailArgs = {
  email: Scalars['String']
};


export type QueryMarketOrdersArgs = {
  page?: Maybe<PageInput>,
  filter?: Maybe<MarketOrderFilter>,
  orderBy?: Maybe<MarketOrderOrderByInput>
};


export type QueryWalletJournalArgs = {
  page?: Maybe<PageInput>,
  filter?: Maybe<WalletJournalFilter>,
  orderBy?: Maybe<WalletJournalOrderByInput>
};


export type QueryWalletTransactionsArgs = {
  page?: Maybe<PageInput>,
  filter?: Maybe<WalletTransactionFilter>,
  orderBy?: Maybe<WalletTransactionOrderByInput>
};


export type QueryWalletTransactionSummaryArgs = {
  ids: Array<Scalars['ID']>
};


export type QueryWalletTransactionIdsArgs = {
  filter?: Maybe<WalletTransactionFilter>
};


export type QueryWarehouseArgs = {
  id: Scalars['ID']
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

export type Skill = {
   __typename?: 'Skill',
  id: Scalars['ID'],
  name: Scalars['String'],
  multiplier?: Maybe<Scalars['Int']>,
  activeSkillLevel?: Maybe<Scalars['Int']>,
  trainedSkillLevel?: Maybe<Scalars['Int']>,
  skillPointsInSkill?: Maybe<Scalars['Int']>,
};

export type SkillGroup = {
   __typename?: 'SkillGroup',
  id: Scalars['ID'],
  name: Scalars['String'],
  skills: Array<Skill>,
  totalSp?: Maybe<Scalars['Int']>,
  totalLevels?: Maybe<Scalars['Int']>,
  trainedSp?: Maybe<Scalars['Int']>,
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

export type WalletJournalFilter = {
  characterId?: Maybe<Scalars['ID']>,
};

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
  character: Character,
  date: Scalars['DateTime'],
  isBuy: Scalars['Boolean'],
  item: InventoryItem,
  location: Location,
  invGroup: InvGroup,
  marketGroup?: Maybe<MarketGroup>,
  quantity: Scalars['Int'],
  unitPrice: Scalars['Float'],
};

export type WalletTransactionFilter = {
  ids?: Maybe<Array<Scalars['ID']>>,
  item?: Maybe<Scalars['String']>,
  characterId?: Maybe<Scalars['ID']>,
  orderType?: Maybe<OrderType>,
};

export enum WalletTransactionOrderBy {
  Date = 'date',
  Client = 'client',
  Character = 'character',
  Credit = 'credit',
  InvGroup = 'invGroup',
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
  lastUpdate?: Maybe<Scalars['DateTime']>,
  transactions: Array<WalletTransaction>,
};

export type WalletTransactionSummary = {
   __typename?: 'WalletTransactionSummary',
  items: Array<WalletTransactionSummaryItem>,
};

export type WalletTransactionSummaryItem = {
   __typename?: 'WalletTransactionSummaryItem',
  id: Scalars['ID'],
  name: Scalars['String'],
  quantity: Scalars['Int'],
  credit: Scalars['Float'],
};

export type Warehouse = {
   __typename?: 'Warehouse',
  id: Scalars['ID'],
  name: Scalars['String'],
  items: Array<WarehouseItem>,
};

export type WarehouseItem = {
   __typename?: 'WarehouseItem',
  id: Scalars['ID'],
  name: Scalars['String'],
  quantity: Scalars['Int'],
  unitCost: Scalars['Float'],
};

export type WarehouseItemInput = {
  id: Scalars['ID'],
  quantity: Scalars['Int'],
  unitCost: Scalars['Float'],
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
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>,
  Character: ResolverTypeWrapper<Partial<Character>>,
  Corporation: ResolverTypeWrapper<Partial<Corporation>>,
  Alliance: ResolverTypeWrapper<Partial<Alliance>>,
  String: ResolverTypeWrapper<Partial<Scalars['String']>>,
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']>>,
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>,
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>,
  SkillGroup: ResolverTypeWrapper<Partial<SkillGroup>>,
  Skill: ResolverTypeWrapper<Partial<Skill>>,
  InvItemFilter: ResolverTypeWrapper<Partial<InvItemFilter>>,
  InvItem: ResolverTypeWrapper<Partial<InvItem>>,
  InvGroup: ResolverTypeWrapper<Partial<InvGroup>>,
  ProcessingLogFilter: ResolverTypeWrapper<Partial<ProcessingLogFilter>>,
  ProcessingLogEntry: ResolverTypeWrapper<Partial<ProcessingLogEntry>>,
  ProcessingCategory: ResolverTypeWrapper<Partial<ProcessingCategory>>,
  ProcessingStatus: ResolverTypeWrapper<Partial<ProcessingStatus>>,
  Scope: ResolverTypeWrapper<Partial<Scope>>,
  User: ResolverTypeWrapper<Partial<User>>,
  UserStatus: ResolverTypeWrapper<Partial<UserStatus>>,
  PageInput: ResolverTypeWrapper<Partial<PageInput>>,
  MarketOrderFilter: ResolverTypeWrapper<Partial<MarketOrderFilter>>,
  OrderStateFilter: ResolverTypeWrapper<Partial<OrderStateFilter>>,
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>,
  MarketOrderOrderByInput: ResolverTypeWrapper<Partial<MarketOrderOrderByInput>>,
  MarketOrderOrderBy: ResolverTypeWrapper<Partial<MarketOrderOrderBy>>,
  Order: ResolverTypeWrapper<Partial<Order>>,
  MarketOrders: ResolverTypeWrapper<Partial<MarketOrders>>,
  MarketOrder: ResolverTypeWrapper<Partial<MarketOrder>>,
  InventoryItem: ResolverTypeWrapper<Partial<InventoryItem>>,
  Location: ResolverTypeWrapper<Partial<Location>>,
  OrderState: ResolverTypeWrapper<Partial<OrderState>>,
  WalletJournalFilter: ResolverTypeWrapper<Partial<WalletJournalFilter>>,
  WalletJournalOrderByInput: ResolverTypeWrapper<Partial<WalletJournalOrderByInput>>,
  WalletJournalOrderBy: ResolverTypeWrapper<Partial<WalletJournalOrderBy>>,
  JournalEntries: ResolverTypeWrapper<Partial<JournalEntries>>,
  JournalEntry: ResolverTypeWrapper<Partial<JournalEntry>>,
  WalletTransactionFilter: ResolverTypeWrapper<Partial<WalletTransactionFilter>>,
  OrderType: ResolverTypeWrapper<Partial<OrderType>>,
  WalletTransactionOrderByInput: ResolverTypeWrapper<Partial<WalletTransactionOrderByInput>>,
  WalletTransactionOrderBy: ResolverTypeWrapper<Partial<WalletTransactionOrderBy>>,
  WalletTransactions: ResolverTypeWrapper<Partial<WalletTransactions>>,
  WalletTransaction: ResolverTypeWrapper<Partial<WalletTransaction>>,
  Client: ResolverTypeWrapper<Partial<Client>>,
  MarketGroup: ResolverTypeWrapper<Partial<MarketGroup>>,
  WalletTransactionSummary: ResolverTypeWrapper<Partial<WalletTransactionSummary>>,
  WalletTransactionSummaryItem: ResolverTypeWrapper<Partial<WalletTransactionSummaryItem>>,
  Warehouse: ResolverTypeWrapper<Partial<Warehouse>>,
  WarehouseItem: ResolverTypeWrapper<Partial<WarehouseItem>>,
  Mutation: ResolverTypeWrapper<{}>,
  RegistrationInput: ResolverTypeWrapper<Partial<RegistrationInput>>,
  WarehouseItemInput: ResolverTypeWrapper<Partial<WarehouseItemInput>>,
  Date: ResolverTypeWrapper<Partial<Scalars['Date']>>,
  Time: ResolverTypeWrapper<Partial<Scalars['Time']>>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  ID: Partial<Scalars['ID']>,
  Character: Partial<Character>,
  Corporation: Partial<Corporation>,
  Alliance: Partial<Alliance>,
  String: Partial<Scalars['String']>,
  DateTime: Partial<Scalars['DateTime']>,
  Int: Partial<Scalars['Int']>,
  Float: Partial<Scalars['Float']>,
  SkillGroup: Partial<SkillGroup>,
  Skill: Partial<Skill>,
  InvItemFilter: Partial<InvItemFilter>,
  InvItem: Partial<InvItem>,
  InvGroup: Partial<InvGroup>,
  ProcessingLogFilter: Partial<ProcessingLogFilter>,
  ProcessingLogEntry: Partial<ProcessingLogEntry>,
  ProcessingCategory: Partial<ProcessingCategory>,
  ProcessingStatus: Partial<ProcessingStatus>,
  Scope: Partial<Scope>,
  User: Partial<User>,
  UserStatus: Partial<UserStatus>,
  PageInput: Partial<PageInput>,
  MarketOrderFilter: Partial<MarketOrderFilter>,
  OrderStateFilter: Partial<OrderStateFilter>,
  Boolean: Partial<Scalars['Boolean']>,
  MarketOrderOrderByInput: Partial<MarketOrderOrderByInput>,
  MarketOrderOrderBy: Partial<MarketOrderOrderBy>,
  Order: Partial<Order>,
  MarketOrders: Partial<MarketOrders>,
  MarketOrder: Partial<MarketOrder>,
  InventoryItem: Partial<InventoryItem>,
  Location: Partial<Location>,
  OrderState: Partial<OrderState>,
  WalletJournalFilter: Partial<WalletJournalFilter>,
  WalletJournalOrderByInput: Partial<WalletJournalOrderByInput>,
  WalletJournalOrderBy: Partial<WalletJournalOrderBy>,
  JournalEntries: Partial<JournalEntries>,
  JournalEntry: Partial<JournalEntry>,
  WalletTransactionFilter: Partial<WalletTransactionFilter>,
  OrderType: Partial<OrderType>,
  WalletTransactionOrderByInput: Partial<WalletTransactionOrderByInput>,
  WalletTransactionOrderBy: Partial<WalletTransactionOrderBy>,
  WalletTransactions: Partial<WalletTransactions>,
  WalletTransaction: Partial<WalletTransaction>,
  Client: Partial<Client>,
  MarketGroup: Partial<MarketGroup>,
  WalletTransactionSummary: Partial<WalletTransactionSummary>,
  WalletTransactionSummaryItem: Partial<WalletTransactionSummaryItem>,
  Warehouse: Partial<Warehouse>,
  WarehouseItem: Partial<WarehouseItem>,
  Mutation: {},
  RegistrationInput: Partial<RegistrationInput>,
  WarehouseItemInput: Partial<WarehouseItemInput>,
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
  skillGroups?: Resolver<Array<ResolversTypes['SkillGroup']>, ParentType, ContextType>,
  skillGroup?: Resolver<Maybe<ResolversTypes['SkillGroup']>, ParentType, ContextType, RequireFields<CharacterSkillGroupArgs, 'id'>>,
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

export type InvGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvGroup'] = ResolversParentTypes['InvGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type InvItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvItem'] = ResolversParentTypes['InvItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  invGroup?: Resolver<ResolversTypes['InvGroup'], ParentType, ContextType>,
};

export type JournalEntriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalEntries'] = ResolversParentTypes['JournalEntries']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  entries?: Resolver<Array<ResolversTypes['JournalEntry']>, ParentType, ContextType>,
};

export type JournalEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalEntry'] = ResolversParentTypes['JournalEntry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MarketGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarketGroup'] = ResolversParentTypes['MarketGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type MarketOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarketOrder'] = ResolversParentTypes['MarketOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>,
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  escrow?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>,
  item?: Resolver<ResolversTypes['InventoryItem'], ParentType, ContextType>,
  isBuy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  isCorporation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>,
  minVolume?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  issued?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  range?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  volumeRemain?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  volumeTotal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  state?: Resolver<ResolversTypes['OrderState'], ParentType, ContextType>,
};

export type MarketOrdersResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarketOrders'] = ResolversParentTypes['MarketOrders']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  orders?: Resolver<Array<ResolversTypes['MarketOrder']>, ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCharacter?: Resolver<ResolversTypes['Character'], ParentType, ContextType, RequireFields<MutationAddCharacterArgs, 'code'>>,
  updateCharacter?: Resolver<ResolversTypes['Character'], ParentType, ContextType, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>,
  removeCharacter?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationRemoveCharacterArgs, 'id'>>,
  register?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>,
  addItemsToWarehouse?: Resolver<Array<ResolversTypes['WarehouseItem']>, ParentType, ContextType, RequireFields<MutationAddItemsToWarehouseArgs, 'id' | 'input'>>,
  updateItemsInWarehouse?: Resolver<Array<ResolversTypes['WarehouseItem']>, ParentType, ContextType, RequireFields<MutationUpdateItemsInWarehouseArgs, 'id' | 'input'>>,
  removeItemsFromWarehouse?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationRemoveItemsFromWarehouseArgs, 'id' | 'itemIds'>>,
  addWarehouse?: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationAddWarehouseArgs, 'name'>>,
  removeWarehouse?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationRemoveWarehouseArgs, 'id'>>,
  updateWarehouse?: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationUpdateWarehouseArgs, 'id' | 'name'>>,
};

export type ProcessingLogEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProcessingLogEntry'] = ResolversParentTypes['ProcessingLogEntry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  character?: Resolver<Maybe<ResolversTypes['Character']>, ParentType, ContextType>,
  category?: Resolver<ResolversTypes['ProcessingCategory'], ParentType, ContextType>,
  status?: Resolver<ResolversTypes['ProcessingStatus'], ParentType, ContextType>,
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  character?: Resolver<Maybe<ResolversTypes['Character']>, ParentType, ContextType, RequireFields<QueryCharacterArgs, 'id'>>,
  characters?: Resolver<Array<ResolversTypes['Character']>, ParentType, ContextType>,
  invItems?: Resolver<Array<ResolversTypes['InvItem']>, ParentType, ContextType, QueryInvItemsArgs>,
  processingLogs?: Resolver<Array<ResolversTypes['ProcessingLogEntry']>, ParentType, ContextType, QueryProcessingLogsArgs>,
  scopes?: Resolver<Array<ResolversTypes['Scope']>, ParentType, ContextType>,
  userByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>,
  marketOrders?: Resolver<ResolversTypes['MarketOrders'], ParentType, ContextType, QueryMarketOrdersArgs>,
  walletJournal?: Resolver<ResolversTypes['JournalEntries'], ParentType, ContextType, QueryWalletJournalArgs>,
  walletTransactions?: Resolver<ResolversTypes['WalletTransactions'], ParentType, ContextType, QueryWalletTransactionsArgs>,
  walletTransactionSummary?: Resolver<ResolversTypes['WalletTransactionSummary'], ParentType, ContextType, RequireFields<QueryWalletTransactionSummaryArgs, 'ids'>>,
  walletTransactionIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType, QueryWalletTransactionIdsArgs>,
  warehouse?: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType, RequireFields<QueryWarehouseArgs, 'id'>>,
  warehouses?: Resolver<Array<ResolversTypes['Warehouse']>, ParentType, ContextType>,
};

export type ScopeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Scope'] = ResolversParentTypes['Scope']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
};

export type SkillResolvers<ContextType = any, ParentType extends ResolversParentTypes['Skill'] = ResolversParentTypes['Skill']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  multiplier?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  activeSkillLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  trainedSkillLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  skillPointsInSkill?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
};

export type SkillGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['SkillGroup'] = ResolversParentTypes['SkillGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  skills?: Resolver<Array<ResolversTypes['Skill']>, ParentType, ContextType>,
  totalSp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  totalLevels?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  trainedSp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
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
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>,
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>,
  isBuy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>,
  item?: Resolver<ResolversTypes['InventoryItem'], ParentType, ContextType>,
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>,
  invGroup?: Resolver<ResolversTypes['InvGroup'], ParentType, ContextType>,
  marketGroup?: Resolver<Maybe<ResolversTypes['MarketGroup']>, ParentType, ContextType>,
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type WalletTransactionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactions'] = ResolversParentTypes['WalletTransactions']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>,
  transactions?: Resolver<Array<ResolversTypes['WalletTransaction']>, ParentType, ContextType>,
};

export type WalletTransactionSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactionSummary'] = ResolversParentTypes['WalletTransactionSummary']> = {
  items?: Resolver<Array<ResolversTypes['WalletTransactionSummaryItem']>, ParentType, ContextType>,
};

export type WalletTransactionSummaryItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactionSummaryItem'] = ResolversParentTypes['WalletTransactionSummaryItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  credit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type WarehouseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Warehouse'] = ResolversParentTypes['Warehouse']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  items?: Resolver<Array<ResolversTypes['WarehouseItem']>, ParentType, ContextType>,
};

export type WarehouseItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['WarehouseItem'] = ResolversParentTypes['WarehouseItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  unitCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  Alliance?: AllianceResolvers<ContextType>,
  Character?: CharacterResolvers<ContextType>,
  Client?: ClientResolvers<ContextType>,
  Corporation?: CorporationResolvers<ContextType>,
  Date?: GraphQLScalarType,
  DateTime?: GraphQLScalarType,
  InventoryItem?: InventoryItemResolvers<ContextType>,
  InvGroup?: InvGroupResolvers<ContextType>,
  InvItem?: InvItemResolvers<ContextType>,
  JournalEntries?: JournalEntriesResolvers<ContextType>,
  JournalEntry?: JournalEntryResolvers<ContextType>,
  Location?: LocationResolvers<ContextType>,
  MarketGroup?: MarketGroupResolvers<ContextType>,
  MarketOrder?: MarketOrderResolvers<ContextType>,
  MarketOrders?: MarketOrdersResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  ProcessingLogEntry?: ProcessingLogEntryResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Scope?: ScopeResolvers<ContextType>,
  Skill?: SkillResolvers<ContextType>,
  SkillGroup?: SkillGroupResolvers<ContextType>,
  Time?: GraphQLScalarType,
  User?: UserResolvers<ContextType>,
  WalletTransaction?: WalletTransactionResolvers<ContextType>,
  WalletTransactions?: WalletTransactionsResolvers<ContextType>,
  WalletTransactionSummary?: WalletTransactionSummaryResolvers<ContextType>,
  WalletTransactionSummaryItem?: WalletTransactionSummaryItemResolvers<ContextType>,
  Warehouse?: WarehouseResolvers<ContextType>,
  WarehouseItem?: WarehouseItemResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
