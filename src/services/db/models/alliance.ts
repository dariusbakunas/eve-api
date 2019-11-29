import BaseModel from './base';

export class Alliance extends BaseModel {
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
