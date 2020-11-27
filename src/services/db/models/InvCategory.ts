import { Model } from 'objection';

export class InvCategory extends Model {
  static tableName = 'invCategories';

  static get idColumn() {
    return 'categoryID';
  }

  readonly categoryID!: number;
  categoryName!: string;
  published!: boolean;
}
