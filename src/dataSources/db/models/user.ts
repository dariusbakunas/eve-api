import { Model } from "objection";

export class User extends Model {
  static tableName = "users";

  readonly id!: number;
  email!: string;
}
