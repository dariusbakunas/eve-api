import { Model } from 'objection';

export class Character extends Model {
  static tableName = 'characters';
  readonly id!: number;
  accessToken!: string;
  allianceId?: number;
  ancestryId!: number;
  birthday!: Date;
  bloodlineId!: number;
  corporationId!: number;
  description?: string;
  expiresAt!: number;
  factionId?: number;
  gender!: string;
  name!: string;
  raceId!: number;
  refreshToken!: string;
  scopes!: string;
  securityStatus?: number;
  title?: string;
  totalSp?: number;
}
