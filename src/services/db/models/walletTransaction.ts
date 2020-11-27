import { Model } from 'objection';

export class WalletTransaction extends Model {
  static tableName = 'walletTransactions';

  readonly id!: number;
  characterId!: number;
  clientId!: number;
  credit!: number;
  groupID!: number;
  marketGroupID?: number;
  typeName!: string;
  groupName!: string;
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
