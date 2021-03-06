import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  Time: any;
  DateTime: any;
};

export type Alliance = {
  __typename?: 'Alliance';
  id: Scalars['ID'];
  name: Scalars['String'];
  ticker: Scalars['String'];
};

export type Blueprint = {
  __typename?: 'Blueprint';
  id: Scalars['ID'];
  character: Character;
  item: InvItem;
  isCopy: Scalars['Boolean'];
  maxRuns: Scalars['Int'];
  materialEfficiency: Scalars['Int'];
  timeEfficiency: Scalars['Int'];
};

export enum BlueprintsOrderBy {
  Character = 'character',
  Name = 'name',
  GroupName = 'groupName',
  MaxRuns = 'maxRuns',
  MaterialEfficiency = 'materialEfficiency',
  TimeEfficiency = 'timeEfficiency'
}

export type BlueprintsOrderByInput = {
  column: BlueprintsOrderBy;
  order: Order;
};

export type BlueprintFilter = {
  characterId?: Maybe<Scalars['ID']>;
};

export type BlueprintsResponse = {
  __typename?: 'BlueprintsResponse';
  total: Scalars['Int'];
  entries: Array<Blueprint>;
};

export type BuildMaterial = {
  __typename?: 'BuildMaterial';
  item: InvItem;
  quantity: Scalars['Int'];
};

export type BuildInfo = {
  __typename?: 'BuildInfo';
  materials: Array<BuildMaterial>;
  product: InvItem;
  quantity: Scalars['Int'];
  time: Scalars['Int'];
  productionLimit: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  blueprints: BlueprintsResponse;
  buildInfo?: Maybe<BuildInfo>;
  character?: Maybe<Character>;
  characterMarketOrders: CharacterMarketOrders;
  characters: Array<Character>;
  industryJobs: IndustryJobs;
  invItems: Array<InvItem>;
  processingLogs: Array<ProcessingLogEntry>;
  scopes: Array<Scope>;
  userByEmail?: Maybe<User>;
  walletJournal: JournalEntries;
  walletTransactionIds: Array<Scalars['ID']>;
  walletTransactionSummary: WalletTransactionSummary;
  walletTransactions: WalletTransactions;
  warehouse?: Maybe<Warehouse>;
  warehouseItems?: Maybe<Array<WarehouseItem>>;
  warehouses: Array<Warehouse>;
};


export type QueryBlueprintsArgs = {
  page?: Maybe<PageInput>;
  filter?: Maybe<BlueprintFilter>;
  orderBy?: Maybe<BlueprintsOrderByInput>;
};


export type QueryBuildInfoArgs = {
  blueprintId: Scalars['ID'];
};


export type QueryCharacterArgs = {
  id: Scalars['ID'];
};


export type QueryCharacterMarketOrdersArgs = {
  page?: Maybe<PageInput>;
  filter?: Maybe<CharacterMarketOrderFilter>;
  orderBy?: Maybe<CharacterMarketOrderOrderByInput>;
};


export type QueryIndustryJobsArgs = {
  page?: Maybe<PageInput>;
  filter?: Maybe<IndustryJobFilter>;
  orderBy?: Maybe<IndustryJobOrderByInput>;
};


export type QueryInvItemsArgs = {
  filter?: Maybe<InvItemFilter>;
};


export type QueryProcessingLogsArgs = {
  filter?: Maybe<ProcessingLogFilter>;
};


export type QueryUserByEmailArgs = {
  email: Scalars['String'];
};


export type QueryWalletJournalArgs = {
  page?: Maybe<PageInput>;
  filter?: Maybe<WalletJournalFilter>;
  orderBy?: Maybe<WalletJournalOrderByInput>;
};


export type QueryWalletTransactionIdsArgs = {
  filter?: Maybe<WalletTransactionFilter>;
};


export type QueryWalletTransactionSummaryArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryWalletTransactionsArgs = {
  page?: Maybe<PageInput>;
  filter?: Maybe<WalletTransactionFilter>;
  orderBy?: Maybe<WalletTransactionOrderByInput>;
};


export type QueryWarehouseArgs = {
  id: Scalars['ID'];
};


export type QueryWarehouseItemsArgs = {
  itemIds: Array<Scalars['ID']>;
  warehouseIds?: Maybe<Array<Scalars['ID']>>;
};

export type Skill = {
  __typename?: 'Skill';
  id: Scalars['ID'];
  name: Scalars['String'];
  multiplier?: Maybe<Scalars['Int']>;
  activeSkillLevel?: Maybe<Scalars['Int']>;
  trainedSkillLevel?: Maybe<Scalars['Int']>;
  skillPointsInSkill?: Maybe<Scalars['Int']>;
};

export type SkillGroup = {
  __typename?: 'SkillGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  skills: Array<Skill>;
  totalSp?: Maybe<Scalars['Int']>;
  totalLevels?: Maybe<Scalars['Int']>;
  trainedSp?: Maybe<Scalars['Int']>;
};

export type SkillQueueItem = {
  __typename?: 'SkillQueueItem';
  position: Scalars['Int'];
  finishDate?: Maybe<Scalars['DateTime']>;
  finishedLevel: Scalars['Int'];
  levelEndSp: Scalars['Int'];
  levelStartSp: Scalars['Int'];
  skill?: Maybe<Skill>;
  startDate?: Maybe<Scalars['DateTime']>;
  trainingStartSp: Scalars['Int'];
};

export type Character = {
  __typename?: 'Character';
  id: Scalars['ID'];
  corporation: Corporation;
  name: Scalars['String'];
  gender: Scalars['String'];
  scopes?: Maybe<Array<Scalars['String']>>;
  birthday: Scalars['DateTime'];
  securityStatus: Scalars['Float'];
  skillGroups: Array<SkillGroup>;
  skillGroup?: Maybe<SkillGroup>;
  skillQueue: Array<SkillQueueItem>;
  totalSp?: Maybe<Scalars['Int']>;
};


export type CharacterSkillGroupArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCharacter: Character;
  addItemsToWarehouse: Array<WarehouseItem>;
  addWarehouse: Warehouse;
  register: User;
  removeCharacter: Scalars['ID'];
  removeItemsFromWarehouse: Array<Scalars['ID']>;
  removeWarehouse: Scalars['ID'];
  updateCharacter: Character;
  updateItemsInWarehouse: Array<WarehouseItem>;
  updateWarehouse: Warehouse;
};


export type MutationAddCharacterArgs = {
  code: Scalars['String'];
};


export type MutationAddItemsToWarehouseArgs = {
  id: Scalars['ID'];
  input: Array<WarehouseItemInput>;
};


export type MutationAddWarehouseArgs = {
  name: Scalars['String'];
};


export type MutationRegisterArgs = {
  input: RegistrationInput;
};


export type MutationRemoveCharacterArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveItemsFromWarehouseArgs = {
  id: Scalars['ID'];
  itemIds: Array<Scalars['ID']>;
};


export type MutationRemoveWarehouseArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateCharacterArgs = {
  id: Scalars['ID'];
  code: Scalars['String'];
};


export type MutationUpdateItemsInWarehouseArgs = {
  id: Scalars['ID'];
  input: Array<WarehouseItemInput>;
};


export type MutationUpdateWarehouseArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Corporation = {
  __typename?: 'Corporation';
  id: Scalars['ID'];
  alliance?: Maybe<Alliance>;
  dateFounded?: Maybe<Scalars['DateTime']>;
  name: Scalars['String'];
  memberCount: Scalars['Int'];
  taxRate: Scalars['Float'];
  ticker: Scalars['String'];
};




export type IndustryActivity = {
  __typename?: 'IndustryActivity';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type IndustryJob = {
  __typename?: 'IndustryJob';
  id: Scalars['ID'];
  activity: IndustryActivity;
  /** The sum of job installation fee and industry facility tax */
  cost?: Maybe<Scalars['Float']>;
  /** Date and time when this job finished */
  endDate: Scalars['DateTime'];
  /** Character which installed this job */
  installer: Character;
  /** Number of runs blueprint is licensed for */
  licensedRuns?: Maybe<Scalars['Int']>;
  /** Date and time when this job was paused (i.e. time when the facility where this job was installed went offline) */
  pauseDate?: Maybe<Scalars['DateTime']>;
  /** Chance of success for invention */
  probability?: Maybe<Scalars['Float']>;
  /** Product (manufactured, copied or invented) */
  product?: Maybe<InvItem>;
  /** Date and time when this job started */
  startDate: Scalars['DateTime'];
  /** Status string */
  status: Scalars['String'];
  /** Number of runs for a manufacturing job, or number of copies to make for a blueprint copy */
  runs: Scalars['Int'];
  /** Number of successful runs for this job. Equal to runs unless this is an invention job */
  successfulRuns?: Maybe<Scalars['Int']>;
};

export type IndustryJobs = {
  __typename?: 'IndustryJobs';
  total: Scalars['Int'];
  jobs: Array<IndustryJob>;
};

export type IndustryJobFilter = {
  installerId?: Maybe<Scalars['ID']>;
};

export enum IndustryJobOrderBy {
  StartDate = 'startDate'
}

export type IndustryJobOrderByInput = {
  column: IndustryJobOrderBy;
  order: Order;
};

export type InvItemFilter = {
  name?: Maybe<Scalars['String']>;
  categoryIds?: Maybe<Array<Scalars['ID']>>;
};

export type InvCategory = {
  __typename?: 'InvCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type InvGroup = {
  __typename?: 'InvGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  category: InvCategory;
};

export type ItemMarketPrice = {
  __typename?: 'ItemMarketPrice';
  buy?: Maybe<Scalars['Float']>;
  sell?: Maybe<Scalars['Float']>;
};

export type InvItem = {
  __typename?: 'InvItem';
  id: Scalars['ID'];
  name: Scalars['String'];
  mass: Scalars['Float'];
  volume: Scalars['Float'];
  invGroup: InvGroup;
  marketPrice?: Maybe<ItemMarketPrice>;
};


export type InvItemVolumeArgs = {
  packaged?: Maybe<Scalars['Boolean']>;
};


export type InvItemMarketPriceArgs = {
  systemId?: Maybe<Scalars['ID']>;
};

export enum ProcessingStatus {
  Success = 'SUCCESS',
  Failure = 'FAILURE'
}

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
  __typename?: 'ProcessingLogEntry';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  character?: Maybe<Character>;
  category: ProcessingCategory;
  status: ProcessingStatus;
  message: Scalars['String'];
  error?: Maybe<Scalars['String']>;
};

export type ProcessingLogFilter = {
  characterIds?: Maybe<Array<Scalars['ID']>>;
};

export type PageInput = {
  index?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
};

export enum Order {
  Asc = 'asc',
  Desc = 'desc'
}

export type Scope = {
  __typename?: 'Scope';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  NotVerified = 'NOT_VERIFIED'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  status: UserStatus;
};

export type RegistrationInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  code: Scalars['String'];
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

export enum WalletJournalOrderBy {
  Date = 'date',
  Amount = 'amount',
  Character = 'character',
  Balance = 'balance',
  Description = 'description'
}

export enum CharacterMarketOrderOrderBy {
  Issued = 'issued'
}

export enum OrderType {
  Buy = 'buy',
  Sell = 'sell'
}

export type WalletTransactionOrderByInput = {
  column: WalletTransactionOrderBy;
  order: Order;
};

export type WalletJournalOrderByInput = {
  column: WalletJournalOrderBy;
  order: Order;
};

export type CharacterMarketOrderOrderByInput = {
  column: CharacterMarketOrderOrderBy;
  order: Order;
};

export type Location = {
  __typename?: 'Location';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Client = {
  __typename?: 'Client';
  id: Scalars['ID'];
  name: Scalars['String'];
  category: Scalars['String'];
};

export enum OrderState {
  Active = 'active',
  Cancelled = 'cancelled',
  Expired = 'expired'
}

export type CharacterMarketOrder = {
  __typename?: 'CharacterMarketOrder';
  id: Scalars['ID'];
  /** Character who issued the order */
  character: Character;
  /** Number of days for which order is valid (starting from the issued date). An order expires at time issued + duration */
  duration: Scalars['Int'];
  /** For buy orders, the amount of ISK in escrow */
  escrow?: Maybe<Scalars['Float']>;
  /** Item transacted in this order */
  item: InvItem;
  /** True if this is buy order */
  isBuy: Scalars['Boolean'];
  /** Signifies whether the buy/sell order was placed on behalf of a corporation */
  isCorporation: Scalars['Boolean'];
  /** Location where order was placed */
  location: Location;
  /** For buy orders, the minimum quantity that will be accepted in a matching sell order */
  minVolume?: Maybe<Scalars['Int']>;
  /** Date and time when this order was issued */
  issued: Scalars['DateTime'];
  /** Cost per unit for this order */
  price: Scalars['Float'];
  /** Valid order range, numbers are ranges in jumps */
  range: Scalars['String'];
  /** Quantity of items still required or offered */
  volumeRemain: Scalars['Int'];
  /** Quantity of items required or offered at time order was placed */
  volumeTotal: Scalars['Int'];
  /** Current order state */
  state: OrderState;
};

export type MarketGroup = {
  __typename?: 'MarketGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type WalletTransaction = {
  __typename?: 'WalletTransaction';
  id: Scalars['ID'];
  credit: Scalars['Float'];
  client: Client;
  character: Character;
  date: Scalars['DateTime'];
  isBuy: Scalars['Boolean'];
  item: InvItem;
  location: Location;
  marketGroup?: Maybe<MarketGroup>;
  quantity: Scalars['Int'];
  unitPrice: Scalars['Float'];
};

export type JournalEntry = {
  __typename?: 'JournalEntry';
  id: Scalars['ID'];
  amount: Scalars['Float'];
  balance: Scalars['Float'];
  character: Character;
  date: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
};

export type WalletTransactions = {
  __typename?: 'WalletTransactions';
  total: Scalars['Int'];
  lastUpdate?: Maybe<Scalars['DateTime']>;
  transactions: Array<WalletTransaction>;
};

export type JournalEntries = {
  __typename?: 'JournalEntries';
  total: Scalars['Int'];
  entries: Array<JournalEntry>;
};

export type CharacterMarketOrders = {
  __typename?: 'CharacterMarketOrders';
  total: Scalars['Int'];
  orders: Array<CharacterMarketOrder>;
};

export type WalletTransactionFilter = {
  ids?: Maybe<Array<Scalars['ID']>>;
  item?: Maybe<Scalars['String']>;
  characterIds?: Maybe<Array<Scalars['ID']>>;
  orderType?: Maybe<OrderType>;
};

export type WalletJournalFilter = {
  characterId?: Maybe<Scalars['ID']>;
};

export type OrderStateFilter = {
  active?: Maybe<Scalars['Boolean']>;
  expired?: Maybe<Scalars['Boolean']>;
  cancelled?: Maybe<Scalars['Boolean']>;
};

export type CharacterMarketOrderFilter = {
  characterId?: Maybe<Scalars['ID']>;
  state?: Maybe<OrderStateFilter>;
};

export type WalletTransactionSummaryItem = {
  __typename?: 'WalletTransactionSummaryItem';
  id: Scalars['ID'];
  name: Scalars['String'];
  quantity: Scalars['Int'];
  credit: Scalars['Float'];
};

export type WalletTransactionSummary = {
  __typename?: 'WalletTransactionSummary';
  items: Array<WalletTransactionSummaryItem>;
};

export type WarehouseItem = {
  __typename?: 'WarehouseItem';
  warehouse: Warehouse;
  item: InvItem;
  quantity: Scalars['Int'];
  unitCost: Scalars['Float'];
};

export type WarehouseSummary = {
  __typename?: 'WarehouseSummary';
  totalCost: Scalars['Float'];
  totalVolume: Scalars['Float'];
};

export type Warehouse = {
  __typename?: 'Warehouse';
  id: Scalars['ID'];
  name: Scalars['String'];
  items: Array<WarehouseItem>;
  summary: WarehouseSummary;
};

export type WarehouseItemInput = {
  id: Scalars['ID'];
  quantity: Scalars['Int'];
  unitCost: Scalars['Float'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Alliance: ResolverTypeWrapper<Partial<Alliance>>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']>>;
  Blueprint: ResolverTypeWrapper<Partial<Blueprint>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']>>;
  BlueprintsOrderBy: ResolverTypeWrapper<Partial<BlueprintsOrderBy>>;
  BlueprintsOrderByInput: ResolverTypeWrapper<Partial<BlueprintsOrderByInput>>;
  BlueprintFilter: ResolverTypeWrapper<Partial<BlueprintFilter>>;
  BlueprintsResponse: ResolverTypeWrapper<Partial<BlueprintsResponse>>;
  BuildMaterial: ResolverTypeWrapper<Partial<BuildMaterial>>;
  BuildInfo: ResolverTypeWrapper<Partial<BuildInfo>>;
  Query: ResolverTypeWrapper<{}>;
  Skill: ResolverTypeWrapper<Partial<Skill>>;
  SkillGroup: ResolverTypeWrapper<Partial<SkillGroup>>;
  SkillQueueItem: ResolverTypeWrapper<Partial<SkillQueueItem>>;
  Character: ResolverTypeWrapper<Partial<Character>>;
  Float: ResolverTypeWrapper<Partial<Scalars['Float']>>;
  Mutation: ResolverTypeWrapper<{}>;
  Corporation: ResolverTypeWrapper<Partial<Corporation>>;
  Date: ResolverTypeWrapper<Partial<Scalars['Date']>>;
  Time: ResolverTypeWrapper<Partial<Scalars['Time']>>;
  DateTime: ResolverTypeWrapper<Partial<Scalars['DateTime']>>;
  IndustryActivity: ResolverTypeWrapper<Partial<IndustryActivity>>;
  IndustryJob: ResolverTypeWrapper<Partial<IndustryJob>>;
  IndustryJobs: ResolverTypeWrapper<Partial<IndustryJobs>>;
  IndustryJobFilter: ResolverTypeWrapper<Partial<IndustryJobFilter>>;
  IndustryJobOrderBy: ResolverTypeWrapper<Partial<IndustryJobOrderBy>>;
  IndustryJobOrderByInput: ResolverTypeWrapper<Partial<IndustryJobOrderByInput>>;
  InvItemFilter: ResolverTypeWrapper<Partial<InvItemFilter>>;
  InvCategory: ResolverTypeWrapper<Partial<InvCategory>>;
  InvGroup: ResolverTypeWrapper<Partial<InvGroup>>;
  ItemMarketPrice: ResolverTypeWrapper<Partial<ItemMarketPrice>>;
  InvItem: ResolverTypeWrapper<Partial<InvItem>>;
  ProcessingStatus: ResolverTypeWrapper<Partial<ProcessingStatus>>;
  ProcessingCategory: ResolverTypeWrapper<Partial<ProcessingCategory>>;
  ProcessingLogEntry: ResolverTypeWrapper<Partial<ProcessingLogEntry>>;
  ProcessingLogFilter: ResolverTypeWrapper<Partial<ProcessingLogFilter>>;
  PageInput: ResolverTypeWrapper<Partial<PageInput>>;
  Order: ResolverTypeWrapper<Partial<Order>>;
  Scope: ResolverTypeWrapper<Partial<Scope>>;
  UserStatus: ResolverTypeWrapper<Partial<UserStatus>>;
  User: ResolverTypeWrapper<Partial<User>>;
  RegistrationInput: ResolverTypeWrapper<Partial<RegistrationInput>>;
  WalletTransactionOrderBy: ResolverTypeWrapper<Partial<WalletTransactionOrderBy>>;
  WalletJournalOrderBy: ResolverTypeWrapper<Partial<WalletJournalOrderBy>>;
  CharacterMarketOrderOrderBy: ResolverTypeWrapper<Partial<CharacterMarketOrderOrderBy>>;
  OrderType: ResolverTypeWrapper<Partial<OrderType>>;
  WalletTransactionOrderByInput: ResolverTypeWrapper<Partial<WalletTransactionOrderByInput>>;
  WalletJournalOrderByInput: ResolverTypeWrapper<Partial<WalletJournalOrderByInput>>;
  CharacterMarketOrderOrderByInput: ResolverTypeWrapper<Partial<CharacterMarketOrderOrderByInput>>;
  Location: ResolverTypeWrapper<Partial<Location>>;
  Client: ResolverTypeWrapper<Partial<Client>>;
  OrderState: ResolverTypeWrapper<Partial<OrderState>>;
  CharacterMarketOrder: ResolverTypeWrapper<Partial<CharacterMarketOrder>>;
  MarketGroup: ResolverTypeWrapper<Partial<MarketGroup>>;
  WalletTransaction: ResolverTypeWrapper<Partial<WalletTransaction>>;
  JournalEntry: ResolverTypeWrapper<Partial<JournalEntry>>;
  WalletTransactions: ResolverTypeWrapper<Partial<WalletTransactions>>;
  JournalEntries: ResolverTypeWrapper<Partial<JournalEntries>>;
  CharacterMarketOrders: ResolverTypeWrapper<Partial<CharacterMarketOrders>>;
  WalletTransactionFilter: ResolverTypeWrapper<Partial<WalletTransactionFilter>>;
  WalletJournalFilter: ResolverTypeWrapper<Partial<WalletJournalFilter>>;
  OrderStateFilter: ResolverTypeWrapper<Partial<OrderStateFilter>>;
  CharacterMarketOrderFilter: ResolverTypeWrapper<Partial<CharacterMarketOrderFilter>>;
  WalletTransactionSummaryItem: ResolverTypeWrapper<Partial<WalletTransactionSummaryItem>>;
  WalletTransactionSummary: ResolverTypeWrapper<Partial<WalletTransactionSummary>>;
  WarehouseItem: ResolverTypeWrapper<Partial<WarehouseItem>>;
  WarehouseSummary: ResolverTypeWrapper<Partial<WarehouseSummary>>;
  Warehouse: ResolverTypeWrapper<Partial<Warehouse>>;
  WarehouseItemInput: ResolverTypeWrapper<Partial<WarehouseItemInput>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Alliance: Partial<Alliance>;
  ID: Partial<Scalars['ID']>;
  String: Partial<Scalars['String']>;
  Blueprint: Partial<Blueprint>;
  Boolean: Partial<Scalars['Boolean']>;
  Int: Partial<Scalars['Int']>;
  BlueprintsOrderByInput: Partial<BlueprintsOrderByInput>;
  BlueprintFilter: Partial<BlueprintFilter>;
  BlueprintsResponse: Partial<BlueprintsResponse>;
  BuildMaterial: Partial<BuildMaterial>;
  BuildInfo: Partial<BuildInfo>;
  Query: {};
  Skill: Partial<Skill>;
  SkillGroup: Partial<SkillGroup>;
  SkillQueueItem: Partial<SkillQueueItem>;
  Character: Partial<Character>;
  Float: Partial<Scalars['Float']>;
  Mutation: {};
  Corporation: Partial<Corporation>;
  Date: Partial<Scalars['Date']>;
  Time: Partial<Scalars['Time']>;
  DateTime: Partial<Scalars['DateTime']>;
  IndustryActivity: Partial<IndustryActivity>;
  IndustryJob: Partial<IndustryJob>;
  IndustryJobs: Partial<IndustryJobs>;
  IndustryJobFilter: Partial<IndustryJobFilter>;
  IndustryJobOrderByInput: Partial<IndustryJobOrderByInput>;
  InvItemFilter: Partial<InvItemFilter>;
  InvCategory: Partial<InvCategory>;
  InvGroup: Partial<InvGroup>;
  ItemMarketPrice: Partial<ItemMarketPrice>;
  InvItem: Partial<InvItem>;
  ProcessingLogEntry: Partial<ProcessingLogEntry>;
  ProcessingLogFilter: Partial<ProcessingLogFilter>;
  PageInput: Partial<PageInput>;
  Scope: Partial<Scope>;
  User: Partial<User>;
  RegistrationInput: Partial<RegistrationInput>;
  WalletTransactionOrderByInput: Partial<WalletTransactionOrderByInput>;
  WalletJournalOrderByInput: Partial<WalletJournalOrderByInput>;
  CharacterMarketOrderOrderByInput: Partial<CharacterMarketOrderOrderByInput>;
  Location: Partial<Location>;
  Client: Partial<Client>;
  CharacterMarketOrder: Partial<CharacterMarketOrder>;
  MarketGroup: Partial<MarketGroup>;
  WalletTransaction: Partial<WalletTransaction>;
  JournalEntry: Partial<JournalEntry>;
  WalletTransactions: Partial<WalletTransactions>;
  JournalEntries: Partial<JournalEntries>;
  CharacterMarketOrders: Partial<CharacterMarketOrders>;
  WalletTransactionFilter: Partial<WalletTransactionFilter>;
  WalletJournalFilter: Partial<WalletJournalFilter>;
  OrderStateFilter: Partial<OrderStateFilter>;
  CharacterMarketOrderFilter: Partial<CharacterMarketOrderFilter>;
  WalletTransactionSummaryItem: Partial<WalletTransactionSummaryItem>;
  WalletTransactionSummary: Partial<WalletTransactionSummary>;
  WarehouseItem: Partial<WarehouseItem>;
  WarehouseSummary: Partial<WarehouseSummary>;
  Warehouse: Partial<Warehouse>;
  WarehouseItemInput: Partial<WarehouseItemInput>;
};

export type AllianceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Alliance'] = ResolversParentTypes['Alliance']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ticker?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlueprintResolvers<ContextType = any, ParentType extends ResolversParentTypes['Blueprint'] = ResolversParentTypes['Blueprint']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['InvItem'], ParentType, ContextType>;
  isCopy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  maxRuns?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  materialEfficiency?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timeEfficiency?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlueprintsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlueprintsResponse'] = ResolversParentTypes['BlueprintsResponse']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entries?: Resolver<Array<ResolversTypes['Blueprint']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BuildMaterialResolvers<ContextType = any, ParentType extends ResolversParentTypes['BuildMaterial'] = ResolversParentTypes['BuildMaterial']> = {
  item?: Resolver<ResolversTypes['InvItem'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BuildInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['BuildInfo'] = ResolversParentTypes['BuildInfo']> = {
  materials?: Resolver<Array<ResolversTypes['BuildMaterial']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['InvItem'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  time?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productionLimit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  blueprints?: Resolver<ResolversTypes['BlueprintsResponse'], ParentType, ContextType, RequireFields<QueryBlueprintsArgs, never>>;
  buildInfo?: Resolver<Maybe<ResolversTypes['BuildInfo']>, ParentType, ContextType, RequireFields<QueryBuildInfoArgs, 'blueprintId'>>;
  character?: Resolver<Maybe<ResolversTypes['Character']>, ParentType, ContextType, RequireFields<QueryCharacterArgs, 'id'>>;
  characterMarketOrders?: Resolver<ResolversTypes['CharacterMarketOrders'], ParentType, ContextType, RequireFields<QueryCharacterMarketOrdersArgs, never>>;
  characters?: Resolver<Array<ResolversTypes['Character']>, ParentType, ContextType>;
  industryJobs?: Resolver<ResolversTypes['IndustryJobs'], ParentType, ContextType, RequireFields<QueryIndustryJobsArgs, never>>;
  invItems?: Resolver<Array<ResolversTypes['InvItem']>, ParentType, ContextType, RequireFields<QueryInvItemsArgs, never>>;
  processingLogs?: Resolver<Array<ResolversTypes['ProcessingLogEntry']>, ParentType, ContextType, RequireFields<QueryProcessingLogsArgs, never>>;
  scopes?: Resolver<Array<ResolversTypes['Scope']>, ParentType, ContextType>;
  userByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserByEmailArgs, 'email'>>;
  walletJournal?: Resolver<ResolversTypes['JournalEntries'], ParentType, ContextType, RequireFields<QueryWalletJournalArgs, never>>;
  walletTransactionIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<QueryWalletTransactionIdsArgs, never>>;
  walletTransactionSummary?: Resolver<ResolversTypes['WalletTransactionSummary'], ParentType, ContextType, RequireFields<QueryWalletTransactionSummaryArgs, 'ids'>>;
  walletTransactions?: Resolver<ResolversTypes['WalletTransactions'], ParentType, ContextType, RequireFields<QueryWalletTransactionsArgs, never>>;
  warehouse?: Resolver<Maybe<ResolversTypes['Warehouse']>, ParentType, ContextType, RequireFields<QueryWarehouseArgs, 'id'>>;
  warehouseItems?: Resolver<Maybe<Array<ResolversTypes['WarehouseItem']>>, ParentType, ContextType, RequireFields<QueryWarehouseItemsArgs, 'itemIds'>>;
  warehouses?: Resolver<Array<ResolversTypes['Warehouse']>, ParentType, ContextType>;
};

export type SkillResolvers<ContextType = any, ParentType extends ResolversParentTypes['Skill'] = ResolversParentTypes['Skill']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  multiplier?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  activeSkillLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  trainedSkillLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  skillPointsInSkill?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SkillGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['SkillGroup'] = ResolversParentTypes['SkillGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<Array<ResolversTypes['Skill']>, ParentType, ContextType>;
  totalSp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalLevels?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  trainedSp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SkillQueueItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['SkillQueueItem'] = ResolversParentTypes['SkillQueueItem']> = {
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  finishDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  finishedLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  levelEndSp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  levelStartSp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  skill?: Resolver<Maybe<ResolversTypes['Skill']>, ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  trainingStartSp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CharacterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Character'] = ResolversParentTypes['Character']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  corporation?: Resolver<ResolversTypes['Corporation'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scopes?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  birthday?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  securityStatus?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  skillGroups?: Resolver<Array<ResolversTypes['SkillGroup']>, ParentType, ContextType>;
  skillGroup?: Resolver<Maybe<ResolversTypes['SkillGroup']>, ParentType, ContextType, RequireFields<CharacterSkillGroupArgs, 'id'>>;
  skillQueue?: Resolver<Array<ResolversTypes['SkillQueueItem']>, ParentType, ContextType>;
  totalSp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCharacter?: Resolver<ResolversTypes['Character'], ParentType, ContextType, RequireFields<MutationAddCharacterArgs, 'code'>>;
  addItemsToWarehouse?: Resolver<Array<ResolversTypes['WarehouseItem']>, ParentType, ContextType, RequireFields<MutationAddItemsToWarehouseArgs, 'id' | 'input'>>;
  addWarehouse?: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationAddWarehouseArgs, 'name'>>;
  register?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  removeCharacter?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationRemoveCharacterArgs, 'id'>>;
  removeItemsFromWarehouse?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationRemoveItemsFromWarehouseArgs, 'id' | 'itemIds'>>;
  removeWarehouse?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationRemoveWarehouseArgs, 'id'>>;
  updateCharacter?: Resolver<ResolversTypes['Character'], ParentType, ContextType, RequireFields<MutationUpdateCharacterArgs, 'id' | 'code'>>;
  updateItemsInWarehouse?: Resolver<Array<ResolversTypes['WarehouseItem']>, ParentType, ContextType, RequireFields<MutationUpdateItemsInWarehouseArgs, 'id' | 'input'>>;
  updateWarehouse?: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType, RequireFields<MutationUpdateWarehouseArgs, 'id' | 'name'>>;
};

export type CorporationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Corporation'] = ResolversParentTypes['Corporation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  alliance?: Resolver<Maybe<ResolversTypes['Alliance']>, ParentType, ContextType>;
  dateFounded?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  memberCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ticker?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type IndustryActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndustryActivity'] = ResolversParentTypes['IndustryActivity']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndustryJobResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndustryJob'] = ResolversParentTypes['IndustryJob']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  activity?: Resolver<ResolversTypes['IndustryActivity'], ParentType, ContextType>;
  cost?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  installer?: Resolver<ResolversTypes['Character'], ParentType, ContextType>;
  licensedRuns?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pauseDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  probability?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['InvItem']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  runs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successfulRuns?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndustryJobsResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndustryJobs'] = ResolversParentTypes['IndustryJobs']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  jobs?: Resolver<Array<ResolversTypes['IndustryJob']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvCategory'] = ResolversParentTypes['InvCategory']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvGroup'] = ResolversParentTypes['InvGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['InvCategory'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemMarketPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemMarketPrice'] = ResolversParentTypes['ItemMarketPrice']> = {
  buy?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  sell?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvItem'] = ResolversParentTypes['InvItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mass?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volume?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<InvItemVolumeArgs, 'packaged'>>;
  invGroup?: Resolver<ResolversTypes['InvGroup'], ParentType, ContextType>;
  marketPrice?: Resolver<Maybe<ResolversTypes['ItemMarketPrice']>, ParentType, ContextType, RequireFields<InvItemMarketPriceArgs, 'systemId'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProcessingLogEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProcessingLogEntry'] = ResolversParentTypes['ProcessingLogEntry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  character?: Resolver<Maybe<ResolversTypes['Character']>, ParentType, ContextType>;
  category?: Resolver<ResolversTypes['ProcessingCategory'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProcessingStatus'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ScopeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Scope'] = ResolversParentTypes['Scope']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['UserStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ClientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CharacterMarketOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['CharacterMarketOrder'] = ResolversParentTypes['CharacterMarketOrder']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  escrow?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  item?: Resolver<ResolversTypes['InvItem'], ParentType, ContextType>;
  isBuy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isCorporation?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  minVolume?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  issued?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  range?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  volumeRemain?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  volumeTotal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['OrderState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarketGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['MarketGroup'] = ResolversParentTypes['MarketGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WalletTransactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransaction'] = ResolversParentTypes['WalletTransaction']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  credit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  client?: Resolver<ResolversTypes['Client'], ParentType, ContextType>;
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isBuy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['InvItem'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['Location'], ParentType, ContextType>;
  marketGroup?: Resolver<Maybe<ResolversTypes['MarketGroup']>, ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JournalEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalEntry'] = ResolversParentTypes['JournalEntry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  balance?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  character?: Resolver<ResolversTypes['Character'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WalletTransactionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactions'] = ResolversParentTypes['WalletTransactions']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastUpdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  transactions?: Resolver<Array<ResolversTypes['WalletTransaction']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JournalEntriesResolvers<ContextType = any, ParentType extends ResolversParentTypes['JournalEntries'] = ResolversParentTypes['JournalEntries']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entries?: Resolver<Array<ResolversTypes['JournalEntry']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CharacterMarketOrdersResolvers<ContextType = any, ParentType extends ResolversParentTypes['CharacterMarketOrders'] = ResolversParentTypes['CharacterMarketOrders']> = {
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orders?: Resolver<Array<ResolversTypes['CharacterMarketOrder']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WalletTransactionSummaryItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactionSummaryItem'] = ResolversParentTypes['WalletTransactionSummaryItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  credit?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WalletTransactionSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['WalletTransactionSummary'] = ResolversParentTypes['WalletTransactionSummary']> = {
  items?: Resolver<Array<ResolversTypes['WalletTransactionSummaryItem']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WarehouseItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['WarehouseItem'] = ResolversParentTypes['WarehouseItem']> = {
  warehouse?: Resolver<ResolversTypes['Warehouse'], ParentType, ContextType>;
  item?: Resolver<ResolversTypes['InvItem'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WarehouseSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['WarehouseSummary'] = ResolversParentTypes['WarehouseSummary']> = {
  totalCost?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalVolume?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WarehouseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Warehouse'] = ResolversParentTypes['Warehouse']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['WarehouseItem']>, ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['WarehouseSummary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Alliance?: AllianceResolvers<ContextType>;
  Blueprint?: BlueprintResolvers<ContextType>;
  BlueprintsResponse?: BlueprintsResponseResolvers<ContextType>;
  BuildMaterial?: BuildMaterialResolvers<ContextType>;
  BuildInfo?: BuildInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Skill?: SkillResolvers<ContextType>;
  SkillGroup?: SkillGroupResolvers<ContextType>;
  SkillQueueItem?: SkillQueueItemResolvers<ContextType>;
  Character?: CharacterResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Corporation?: CorporationResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Time?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  IndustryActivity?: IndustryActivityResolvers<ContextType>;
  IndustryJob?: IndustryJobResolvers<ContextType>;
  IndustryJobs?: IndustryJobsResolvers<ContextType>;
  InvCategory?: InvCategoryResolvers<ContextType>;
  InvGroup?: InvGroupResolvers<ContextType>;
  ItemMarketPrice?: ItemMarketPriceResolvers<ContextType>;
  InvItem?: InvItemResolvers<ContextType>;
  ProcessingLogEntry?: ProcessingLogEntryResolvers<ContextType>;
  Scope?: ScopeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  CharacterMarketOrder?: CharacterMarketOrderResolvers<ContextType>;
  MarketGroup?: MarketGroupResolvers<ContextType>;
  WalletTransaction?: WalletTransactionResolvers<ContextType>;
  JournalEntry?: JournalEntryResolvers<ContextType>;
  WalletTransactions?: WalletTransactionsResolvers<ContextType>;
  JournalEntries?: JournalEntriesResolvers<ContextType>;
  CharacterMarketOrders?: CharacterMarketOrdersResolvers<ContextType>;
  WalletTransactionSummaryItem?: WalletTransactionSummaryItemResolvers<ContextType>;
  WalletTransactionSummary?: WalletTransactionSummaryResolvers<ContextType>;
  WarehouseItem?: WarehouseItemResolvers<ContextType>;
  WarehouseSummary?: WarehouseSummaryResolvers<ContextType>;
  Warehouse?: WarehouseResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
