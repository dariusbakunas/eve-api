import EsiAPI from '../services/esi/api';
import db from '../services/db';
import { Character } from '../services/db/models/character';
import { getAccessToken } from '../resolvers/common';
import Crypt from '../services/crypt';
import EsiAuth from '../services/esi/auth';
import logger from '../utils/logger';
import { transaction } from 'objection';
import { WalletTransaction } from '../services/db/models/walletTransaction';
import { InMemoryLRUCache } from 'apollo-server-caching';

const initDataSources = () => {
  const dataSources = {
    esiAuth: new EsiAuth(process.env.EVE_LOGIN_URL!),
    esiApi: new EsiAPI(process.env.EVE_ESI_URL!, new InMemoryLRUCache()),
    db: db,
    crypt: new Crypt(process.env.TOKEN_SECRET!),
  };

  dataSources.esiApi.initialize({ context: null, cache: new InMemoryLRUCache() });
  dataSources.esiAuth.initialize({ context: null, cache: new InMemoryLRUCache() });

  return dataSources;
};

export const processData = async () => {
  const { db, crypt, esiAuth, esiApi } = initDataSources();
  const characters = await db.Character.query();

  for (let i = 0; i < characters.length; i++) {
    const character: Character = characters[i];
    const { id, accessToken, refreshToken, expiresAt, scopes, name } = character;

    const token = await getAccessToken(
      id,
      accessToken,
      refreshToken,
      expiresAt,
      db,
      crypt,
      esiAuth
    );

    if (scopes.includes('esi-wallet.read_character_wallet.v1')) {
      logger.info(`Getting transactions for character: ${name}`);
      const transactions = await esiApi.getWalletTransactions(id, token);

      const knex = WalletTransaction.knex();
      let inserted = 0;

      await transaction(knex, async trx => {
        for (let t = 0; t < transactions.length; t++) {
          const walletTransaction = transactions[t];

          const exists = await db.WalletTransaction.query(trx)
            .select('id')
            .where({
              id: walletTransaction.transactionId,
            });

          if (!exists.length) {
            await db.WalletTransaction.query(trx).insert({
              id: walletTransaction.transactionId,
              characterId: character.id,
              clientId: walletTransaction.clientId,
              isBuy: walletTransaction.isBuy,
              isPersonal: walletTransaction.isPersonal,
              quantity: walletTransaction.quantity,
              typeId: walletTransaction.typeId,
              locationId: walletTransaction.locationId,
              journalRefId: walletTransaction.journalRefId,
              unitPrice: walletTransaction.unitPrice,
              date: walletTransaction.date,
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
    }
  }
};
