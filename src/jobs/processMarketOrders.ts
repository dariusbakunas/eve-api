import { Character } from '../services/db/models/character';
import { CharacterMarketOrder } from '../services/db/models/characterMarketOrder';
import { IDataSources } from '../services';
import { PartialUpdate, transaction } from 'objection';
import logger from '../utils/logger';
import moment = require('moment');

export const processMarketOrders = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting market orders for character: ${character.name}`);

  try {
    const activeOrders = await esiApi.getCharacterMarketOrders(character.id, token);
    const orderHistory = await esiApi.getOrderHistory(character.id, token);

    const orders = [...activeOrders, ...orderHistory];

    const knex = CharacterMarketOrder.knex();

    await transaction(knex, async trx => {
      const existingOrders: Array<{ id: number; state: string; issued: string; duration: number }> = await db.CharacterMarketOrder.query(trx)
        .select('id', 'state', 'duration', 'issued')
        .where('characterId', character.id);

      const orderMap = existingOrders.reduce<{ [key: number]: string }>((acc, order) => {
        acc[order.id] = order.state;
        return acc;
      }, {});

      let newOrders = 0;
      let updated = 0;

      for (let i = 0; i < existingOrders.length; i++) {
        const order = existingOrders[i];
        const expires = moment(order.issued).add(order.duration, 'days');
        if (expires.isBefore()) {
          // mark this order expired (esi does not always return all expired orders)
          order.state = 'expired';

          const update: PartialUpdate<CharacterMarketOrder> = {
            state: 'expired',
          };

          await db.CharacterMarketOrder.query(trx)
            .findById(order.id)
            .patch(update);
        }
      }

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        if (!orderMap[order.order_id]) {
          newOrders++;
          await db.CharacterMarketOrder.query(trx).insert({
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
            const update: PartialUpdate<CharacterMarketOrder> = {
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

            await db.CharacterMarketOrder.query(trx)
              .findById(order.order_id)
              .patch(update);

            updated++;
          }
        }
      }

      const message = `Finished processing market orders, new: ${newOrders}, updated: ${updated}`;
      logger.info(`${message}, for ${character.name}`);

      await db.JobLogEntry.query().insert({
        category: 'MARKET_ORDERS',
        status: 'SUCCESS',
        message: message,
        characterId: character.id,
      });
    });
  } catch (e) {
    logger.error(`Failed to get market orders for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'MARKET_ORDERS',
      status: 'FAILURE',
      message: 'Failed to get market orders',
      error: e.message,
      characterId: character.id,
    });
  }
};
