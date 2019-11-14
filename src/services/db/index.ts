import { Model } from 'objection';
import Knex from 'knex';
import { Scope } from './models/scope';
import { User } from './models/user';
import { Character } from './models/character';
import { Invitation } from './models/invitation';
import { InventoryItem } from './models/InventoryItem';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import config from '../../../knexfile';
import { WalletTransaction } from './models/walletTransaction';

import { JournalEntry } from './models/journalEntry';
import { IDataSources } from '../index';
import { Station } from './models/station';
import { NameCacheItem } from './models/nameCacheItem';

const knex = Knex(config[process.env.NODE_ENV]);

//knex.migrate.latest();
Model.knex(knex);

const db: IDataSources['db'] = {
  Character,
  NameCacheItem,
  JournalEntry,
  User,
  Scope,
  Invitation,
  InventoryItem,
  Station,
  WalletTransaction,
};

export default db;
