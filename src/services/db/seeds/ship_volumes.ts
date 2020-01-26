import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex('shipVolumes')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('shipVolumes').insert([
        { groupId: 25, volume: 2500 },
        { groupId: 26, volume: 10000 },
        { groupId: 27, volume: 50000 },
        { groupId: 28, volume: 10000 },
        { groupId: 30, volume: 13000000 },
        { groupId: 31, volume: 500 },
        { groupId: 237, volume: 2500 },
        { groupId: 324, volume: 2500 },
        { groupId: 358, volume: 10000 },
        { groupId: 380, volume: 10000 },
        { groupId: 419, volume: 15000 },
        { groupId: 420, volume: 5000 },
        { groupId: 463, volume: 3750 },
        { groupId: 485, volume: 1300000 },
        { groupId: 513, volume: 1300000 },
        { groupId: 540, volume: 15000 },
        { groupId: 541, volume: 5000 },
        { groupId: 543, volume: 3750 },
        { groupId: 547, volume: 1300000 },
        { groupId: 659, volume: 13000000 },
        { groupId: 830, volume: 2500 },
        { groupId: 831, volume: 2500 },
        { groupId: 832, volume: 10000 },
        { groupId: 833, volume: 10000 },
        { groupId: 834, volume: 2500 },
        { groupId: 883, volume: 1300000 },
        { groupId: 893, volume: 2500 },
        { groupId: 894, volume: 10000 },
        { groupId: 898, volume: 50000 },
        { groupId: 900, volume: 50000 },
        { groupId: 902, volume: 1300000 },
        { groupId: 906, volume: 10000 },
        { groupId: 941, volume: 500000 },
        { groupId: 963, volume: 10000 },
        { groupId: 1022, volume: 500 },
        { groupId: 1201, volume: 15000 },
        { groupId: 1202, volume: 10000 },
        { groupId: 1283, volume: 2500 },
        { groupId: 1305, volume: 5000 },
      ]);
    });
}
