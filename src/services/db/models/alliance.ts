import { Model } from 'objection';

export class Alliance extends Model {
  static tableName = 'alliances';

  readonly id!: number;
  creatorCorporationId!: number;
  creatorId!: number;
  name!: string;
  dateFounded!: Date;
  executorCorporationId!: number;
  factionId?: number;
  ticker!: string;
}
