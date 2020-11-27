import { Model } from 'objection';

export class Corporation extends Model {
  static tableName = 'corporations';

  readonly id!: number;
  allianceId?: number;
  ceoId!: number;
  creatorId!: number;
  dateFounded?: Date;
  description?: string;
  factionId?: number;
  homeStationId?: number;
  memberCount!: number;
  name!: string;
  shares?: number;
  taxRate!: number;
  ticker!: string;
  url?: string;
  warEligible?: boolean;
}
