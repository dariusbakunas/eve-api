import BaseModel from './base';

export class Invitation extends BaseModel {
  static tableName = 'invitations';

  readonly id!: number;
  email!: string;
  code!: string;
}
