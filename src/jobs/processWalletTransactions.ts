import { Character } from '../services/db/models/character';
import { IDataSources } from '../services';
import { transaction } from 'objection';
import { WalletTransaction } from '../services/db/models/walletTransaction';
import logger from '../utils/logger';
import moment from 'moment';

export const processWalletTransactions = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting transactions for character: ${character.name}`);

  try {
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

    const message = inserted > 0 ? `${inserted} new transactions` : 'No new transactions';
    logger.info(`${message} for ${character.name}`);

    await db.JobLogEntry.query().insert({
      category: 'WALLET_TRANSACTIONS',
      status: 'SUCCESS',
      message: message,
      characterId: character.id,
    });
  } catch (e) {
    logger.error(`Failed to get wallet transactions for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'WALLET_TRANSACTIONS',
      status: 'FAILURE',
      message: 'Failed to get wallet transactions',
      error: e.message,
      characterId: character.id,
    });
  }
};
