import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import logger from '../utils/logger';
import { MarketOrder } from '../services/db/models/marketOrder';
import { PartialUpdate, transaction } from 'objection';
import moment = require('moment');

export const processMarketOrders = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting market orders for character: ${character.name}`);
  const activeOrders = await esiApi.getActiveMarketOrders(character.id, token);
  const orderHistory = await esiApi.getOrderHistory(character.id, token);

  const orders = [...activeOrders, ...orderHistory];

  const knex = MarketOrder.knex();

  await transaction(knex, async trx => {
    const existingOrders: Array<{ id: number; state: string }> = await db.MarketOrder.query(trx)
      .select('id', 'state')
      .where('characterId', character.id);

    const orderMap = existingOrders.reduce<{ [key: number]: string }>((acc, order) => {
      acc[order.id] = order.state;
      return acc;
    }, {});

    let newOrders = 0;
    let updated = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];

      if (!orderMap[order.order_id]) {
        newOrders++;
        await db.MarketOrder.query(trx).insert({
          id: order.order_id,
          characterId: character.id,
          duration: order.duration,
          escrow: order.escrow,
          isBuy: !!order.is_buy_order,
          isCorporation: order.is_corporation,
          issued: moment(order.issued).toDate(),
          locationId: order.location_id,
          minVolume: order.min_volume,
          price: order.price,
          range: order.range,
          regionId: order.region_id,
          typeId: order.type_id,
          state: order.state || 'active',
          volumeRemain: order.volume_remain,
          volumeTotal: order.volume_total,
        });
      } else {
        const state = orderMap[order.order_id];
        if (state === 'active') {
          // no need to update expired or cancelled orders
          updated++;
          const update: PartialUpdate<MarketOrder> = {
            duration: order.duration,
            escrow: order.escrow,
            issued: moment(order.issued).toDate(),
            minVolume: order.min_volume,
            price: order.price,
            range: order.range,
            state: order.state || 'active',
            volumeRemain: order.volume_remain,
            volumeTotal: order.volume_total,
          };

          await db.MarketOrder.query(trx)
            .findById(order.order_id)
            .patch(update);
        }
      }
    }

    logger.info(`Finished processing market orders, new: ${newOrders}, updated: ${updated}`);
  });
};
