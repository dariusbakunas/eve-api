import logger from '../utils/logger';
import { Character } from '../services/db/models/character';
import { transaction } from 'objection';
import { JournalEntry } from '../services/db/models/journalEntry';
import { IDataSources } from '../services';
import moment from 'moment';

export const processJournalEntries = async (character: Character, token: string, db: IDataSources['db'], esiApi: IDataSources['esiApi']) => {
  logger.info(`Getting journal entries for character: ${character.name}`);

  try {
    const journalEntries = await esiApi.getJournalEntries(character.id, token);

    const knex = JournalEntry.knex();
    let inserted = 0;

    await transaction(knex, async trx => {
      const existingEntries = await db.JournalEntry.query(trx)
        .select('id')
        .where('characterId', character.id)
        .pluck('id');

      const entrySet = new Set(existingEntries);

      for (let i = 0; i < journalEntries.length; i++) {
        const entry = journalEntries[i];

        if (!entrySet.has(entry.id)) {
          await db.JournalEntry.query(trx).insert({
            id: entry.id,
            amount: entry.amount,
            balance: entry.balance,
            characterId: character.id,
            contextId: entry.context_id,
            contextIdType: entry.context_id_type,
            date: moment(entry.date).toDate(),
            description: entry.description,
            firstPartyId: entry.first_party_id,
            reason: entry.reason,
            refType: entry.ref_type,
            secondPartyId: entry.second_party_id,
            tax: entry.tax,
            taxReceiverId: entry.tax_receiver_id,
          });
          inserted++;
        }
      }
    });

    const message = inserted > 0 ? `${inserted} new journal entries` : 'No new journal entries';
    logger.info(`${message} for ${character.name}`);

    await db.JobLogEntry.query().insert({
      category: 'WALLET_JOURNAL',
      status: 'SUCCESS',
      message: message,
      characterId: character.id,
    });
  } catch (e) {
    logger.error(`Failed to get journal entries for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'WALLET_JOURNAL',
      status: 'FAILURE',
      message: 'Failed to get wallet journal',
      error: e.message,
      characterId: character.id,
    });
  }
};
