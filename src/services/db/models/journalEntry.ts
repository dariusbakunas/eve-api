import { Model } from 'objection';

export class JournalEntry extends Model {
  static tableName = 'journalEntries';

  readonly id!: number;
  amount?: number;
  balance?: number;
  characterId!: number;
  contextId?: number;
  contextIdType?: number;
  date!: Date;
  description!: string;
  firstPartyId?: number;
  reason?: string;
  refType!: string;
  secondPartyId?: number;
  tax?: number;
  taxReceiverId?: number;
}
