import { Model } from 'objection';

export class Invitation extends Model {
  static tableName = 'invitations';

  readonly id!: number;
  email!: string;
  code!: string;
}
