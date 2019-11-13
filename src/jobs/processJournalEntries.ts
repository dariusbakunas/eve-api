import logger from '../utils/logger';
import { Character } from '../services/db/models/character';
import { transaction } from 'objection';
import { JournalEntry } from '../services/db/models/journalEntry';
import { IDataSources } from '../services';

export const processJournalEntries = async (
  character: Character,
  token: string,
  db: IDataSources['db'],
  esiApi: IDataSources['esiApi']
) => {
  logger.info(`Getting journal entries for character: ${character.name}`);
  const journalEntries = await esiApi.getJournalEntries(character.id, token);

  const knex = JournalEntry.knex();
  let inserted = 0;

  await transaction(knex, async trx => {
    for (let i = 0; i < journalEntries.length; i++) {
      const entry = journalEntries[i];

      const exists = await db.JournalEntry.query(trx)
        .select('id')
        .where({
          id: entry.id,
        });

      if (!exists.length) {
        await db.JournalEntry.query(trx).insert(entry);
        inserted++;
      }
    }
  });

  if (inserted > 0) {
    logger.info(`${inserted} new journal entries for ${character.name}`);
  } else {
    logger.info(`No new journal entries for ${character.name}`);
  }
};
