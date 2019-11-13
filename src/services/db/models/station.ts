import BaseModel from './base';

export class Station extends BaseModel {
  static tableName = 'staStations';

  static get idColumn() {
    return 'stationID';
  }

  readonly stationID!: number;
  stationName!: string;
}
