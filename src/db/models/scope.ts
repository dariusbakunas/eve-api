import { Model } from 'objection';

export class Scope extends Model {
  static get tableName() {
    return 'scopes';
  }
}
