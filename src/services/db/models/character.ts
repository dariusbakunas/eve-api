import BaseModel from './base';

export class Character extends BaseModel {
  static tableName = 'characters';
  readonly id!: number;
  name!: string;
  accessToken!: string;
  corporationId!: number;
  allianceId?: number;
  factionId?: number;
  securityStatus?: number;
  title?: string;
  refreshToken!: string;
  expiresAt!: number;
  scopes!: string;
  ancestryId!: number;
  bloodlineId!: number;
  birthday!: Date;
  gender!: string;
  raceId!: number;
  totalSp?: number;
}
