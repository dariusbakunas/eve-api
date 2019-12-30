import { Blueprint } from '../services/db/models/blueprint';
import { Character } from '../services/db/models/character';
import { getCharacterBlueprints } from '../services/esi/fetchApi';
import { IDataSources } from '../services';
import { PartialUpdate, transaction } from 'objection';
import logger from '../utils/logger';

export const processBlueprints = async (character: Character, token: string, db: IDataSources['db']) => {
  logger.info(`Getting blueprints for character: ${character.name}`);

  try {
    const { data: blueprints, pages } = await getCharacterBlueprints(character.id, token);

    if (pages > 1) {
      logger.warn('Blueprint fetch for multiple pages not yet implemented');
    }

    const knex = Blueprint.knex();

    await transaction(knex, async trx => {
      const existingBlueprintsIds = await db.Blueprint.query(trx)
        .select('id')
        .where('characterId', character.id)
        .pluck('id');

      const blueprintIdSet = new Set(existingBlueprintsIds);

      let newBlueprints = 0;
      let updated = 0;
      const processedIds = [];

      for (let i = 0; i < blueprints.length; i++) {
        const blueprint = blueprints[i];
        processedIds.push(blueprint.item_id);

        if (blueprintIdSet.has(blueprint.item_id)) {
          // update
          const update: PartialUpdate<Blueprint> = {
            locationType: blueprint.location_flag,
            locationId: blueprint.location_id,
            materialEfficiency: blueprint.material_efficiency,
            maxRuns: blueprint.runs,
            timeEfficiency: blueprint.time_efficiency,
          };

          await db.Blueprint.query(trx)
            .findById(blueprint.item_id)
            .patch(update);

          updated++;
        } else {
          // new
          await db.Blueprint.query(trx).insert({
            id: blueprint.item_id,
            locationType: blueprint.location_flag,
            locationId: blueprint.location_id,
            materialEfficiency: blueprint.material_efficiency,
            isCopy: blueprint.runs !== -1,
            maxRuns: blueprint.runs,
            timeEfficiency: blueprint.time_efficiency,
            typeId: blueprint.type_id,
            characterId: character.id,
          });
          newBlueprints++;
        }
      }

      const processedIdSet = new Set(processedIds);
      const idsToRemove = existingBlueprintsIds.filter((id: number) => !processedIdSet.has(id));

      if (idsToRemove.length) {
        await db.Blueprint.query(trx)
          .delete()
          .where('id', 'in', idsToRemove)
          .andWhere('characterId', character.id);
      }

      const message = `Finished processing blueprints, new: ${newBlueprints}, updated: ${updated}, deleted: ${idsToRemove.length}`;
      logger.info(`${message}, for ${character.name}`);

      await db.JobLogEntry.query().insert({
        category: 'BLUEPRINTS',
        status: 'SUCCESS',
        message: message,
        characterId: character.id,
      });
    });
  } catch (e) {
    logger.error(`Failed to get blueprints for ${character.name}: ${e.message}`);
    await db.JobLogEntry.query().insert({
      category: 'BLUEPRINTS',
      status: 'FAILURE',
      message: 'Failed to get blueprints',
      error: e.message,
      characterId: character.id,
    });
  }
};
