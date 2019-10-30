import logger from '../../../utils/logger';
import { Constructor, Model, QueryBuilder, Transaction } from 'objection';
import Knex = require('knex');

class BaseModel extends Model {
  static query<QB extends QueryBuilder<BaseModel>>(trxOrKnex?: Transaction | Knex<any, any[]>) {
    return super.query.call(this, trxOrKnex).onBuildKnex(knexQueryBuilder => {
      knexQueryBuilder.on('query', (queryData: { sql: string; method: string }) => {
        logger.debug(`SQL: ${queryData.sql}`);
      });
    }) as any;
  }
}

export default BaseModel;
