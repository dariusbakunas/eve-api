import logger from '../utils/logger';
import { Character } from '../services/db/models/character';
import { WalletTransaction } from '../services/db/models/walletTransaction';
import { transaction } from 'objection';
import { IDataSources } from '../services';

export const processWalletTransactions = async (
  character: Character,
  token: string,
  db: IDataSources['db'],
  esiApi: IDataSources['esiApi']
) => {
  logger.info(`Getting transactions for character: ${character.name}`);
  const transactions = await esiApi.getWalletTransactions(character.id, token);

  const knex = WalletTransaction.knex();
  let inserted = 0;

  await transaction(knex, async trx => {
    for (let t = 0; t < transactions.length; t++) {
      const walletTransaction = transactions[t];

      const exists = await db.WalletTransaction.query(trx)
        .select('id')
        .where({
          id: walletTransaction.id,
        });

      if (!exists.length) {
        await db.WalletTransaction.query(trx).insert(walletTransaction);

        inserted++;
      }
    }
  });

  if (inserted > 0) {
    logger.info(`${inserted} new transactions for ${character.name}`);
  } else {
    logger.info(`No new transactions for ${character.name}`);
  }
};
