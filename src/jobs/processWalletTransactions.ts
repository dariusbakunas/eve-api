import logger from '../utils/logger';
import { Character } from '../services/db/models/character';
import { WalletTransaction } from '../services/db/models/walletTransaction';
import { transaction } from 'objection';
import { IDataSources } from '../services';
import moment from 'moment';

export const processWalletTransactions = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting transactions for character: ${character.name}`);
  const transactions = await esiApi.getWalletTransactions(character.id, token);

  const knex = WalletTransaction.knex();
  let inserted = 0;

  await transaction(knex, async trx => {
    const existingEntries = await db.WalletTransaction.query(trx)
      .select('id')
      .where('characterId', character.id)
      .pluck('id');

    const entrySet = new Set(existingEntries);

    for (let t = 0; t < transactions.length; t++) {
      const walletTransaction = transactions[t];

      if (!entrySet.has(walletTransaction.transaction_id)) {
        await db.WalletTransaction.query(trx).insert({
          clientId: walletTransaction.client_id,
          characterId: character.id,
          date: moment(walletTransaction.date).toDate(),
          isBuy: walletTransaction.is_buy,
          isPersonal: walletTransaction.is_personal,
          journalRefId: walletTransaction.journal_ref_id,
          locationId: walletTransaction.location_id,
          quantity: walletTransaction.quantity,
          id: walletTransaction.transaction_id,
          typeId: walletTransaction.type_id,
          unitPrice: walletTransaction.unit_price,
        });

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
