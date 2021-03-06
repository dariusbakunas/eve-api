import { Model } from 'objection';

export class JobLogEntry extends Model {
  static tableName = 'jobLogs';

  readonly id!: number;
  createdAt!: Date;
  category!:
    | 'WALLET_TRANSACTIONS'
    | 'WALLET_JOURNAL'
    | 'BOOKMARKS'
    | 'MARKET_ORDERS'
    | 'ASSETS'
    | 'CALENDAR'
    | 'BLUEPRINTS'
    | 'CLONES'
    | 'IMPLANTS'
    | 'CONTACTS'
    | 'CONTRACTS'
    | 'INDUSTRY_JOBS'
    | 'STATS'
    | 'SKILLS'
    | 'SKILL_QUEUE';
  status!: 'SUCCESS' | 'FAILURE';
  message!: string;
  error?: string;
  characterId?: number;
  corporationId?: number;
}
