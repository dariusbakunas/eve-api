import { getMarketOrders } from '../services/esi/fetchApi';
import { IDataSources } from '../services';
import { IEsiMarketOrder } from '../services/esi/esiTypes';
import db from '../services/db';
import logger from '../utils/logger';

const JITA_REGION_ID = 10000002;
const processMarketOrders = (db: IDataSources['db'], orders: IEsiMarketOrder[]) => {};

(async function() {
  try {
    const ordersResponse = await getMarketOrders(JITA_REGION_ID, 1);
    const orders = [...ordersResponse.data];

    if (ordersResponse.pages > 1) {
      for (let i = 2; i < ordersResponse.pages; i++) {
        const response = await getMarketOrders(JITA_REGION_ID, i);
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
