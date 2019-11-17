import BaseModel from './base';

export class WalletTransaction extends BaseModel {
  static tableName = 'walletTransactions';

  readonly id!: number;
  characterId!: number;
  clientId!: number;
  credit!: number;
  isBuy!: boolean;
  isPersonal!: boolean;
  quantity!: number;
  typeId!: number;
  locationId!: number;
  locationName?: string;
  journalRefId!: number;
  unitPrice!: number;
  date!: Date;
}
