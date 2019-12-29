import { getMarketOrders } from '../services/esi/fetchApi';
import { IDataSources } from '../services';
import { IEsiMarketOrder } from '../services/esi/esiTypes';
import { MarketOrder } from '../services/db/models/marketOrder';
import { PartialUpdate, transaction } from 'objection';
import db from '../services/db';
import logger from '../utils/logger';
import moment from 'moment';

// for now only process Forge
const FORGE_REGION_ID = 10000002;

const processMarketOrders = async (db: IDataSources['db'], orders: IEsiMarketOrder[]) => {
  const knex = db.MarketOrder.knex();
  const orderIdSet = new Set(orders.map(order => order.order_id));

  try {
    await transaction(knex, async trx => {
      const existingOrderIds = await db.MarketOrder.query(trx)
        .select('id')
        .pluck('id');
      const existingIdSet = new Set(existingOrderIds);

      let inserted = 0;
      let updated = 0;

      // insert/update orrders
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        if (existingIdSet.has(order.order_id)) {
          // update
          const update: PartialUpdate<MarketOrder> = {
            issued: moment(order.issued).toDate(),
            price: order.price,
            volumeRemain: order.volume_remain,
            volumeTotal: order.volume_total,
          };

          await db.MarketOrder.query(trx)
            .findById(order.order_id)
            .patch(update);

          updated++;
        } else {
          // insert
          await db.MarketOrder.query(trx).insert({
            id: order.order_id,
            duration: order.duration,
            isBuy: order.is_buy_order,
            issued: moment(order.issued).toDate(),
            locationId: order.location_id,
            minVolume: order.min_volume,
            price: order.price,
            range: order.range,
            systemId: order.system_id,
            typeId: order.type_id,
            volumeRemain: order.volume_remain,
            volumeTotal: order.volume_total,
          });

          inserted++;
        }
      }

      // remove orders that were no longer in response
      // TODO: update this when more regions are added
      const idsToDelete = existingOrderIds.filter((id: number) => !orderIdSet.has(id));
      if (idsToDelete.length) {
        await db.MarketOrder.query(trx)
          .delete()
          .where('id', 'in', idsToDelete);
      }

      logger.info(`Finished processing market orders. Inserted: ${inserted}, updated: ${updated}, deleted" ${idsToDelete.length}`);
    });
  } catch (e) {
    logger.error(`Failed to process market orders: ${e}`);
  }
};

(async function() {
  try {
    const ordersResponse = await getMarketOrders(FORGE_REGION_ID, 1);
    const orders = [...ordersResponse.data];

    if (ordersResponse.pages > 1) {
      for (let i = 2; i < ordersResponse.pages; i++) {
        const response = await getMarketOrders(FORGE_REGION_ID, i);
        orders.push(...response.data);
      }
    }

    logger.info(`Fetched ${orders.length} market orders`);
    await processMarketOrders(db, orders);
  } catch (e) {
    logger.error(`Failed to fetch market orders: ${e}`);
  }

  process.exit(0);
})();
