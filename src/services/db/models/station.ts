import { Model } from 'objection';

export class Station extends Model {
  static tableName = 'staStations';

  static get idColumn() {
    return 'stationID';
  }

  readonly stationID!: number;
  stationName!: string;
}
