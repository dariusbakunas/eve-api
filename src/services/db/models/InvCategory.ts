import BaseModel from './base';

export class InvCategory extends BaseModel {
  static tableName = 'invCategories';

  static get idColumn() {
    return 'categoryID';
  }

  readonly categoryID!: number;
  categoryName!: string;
  published!: boolean;
}
