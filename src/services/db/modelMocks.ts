import { faker } from '@faker-js/faker';
import { Character, Prisma } from '@prisma/client';

// export const createMockCorporation = (): Corporation => {
//   return {
//     id: faker.datatype.number(),
//     memberCount: faker.datatype.number(),
//     name: faker.company.name(),
//     taxRate: new Prisma.Decimal(faker.datatype.float({ min: 0, max: 1 })),
//     ticker: faker.company.bsBuzz(),
//   }
// }

export const createMockCharacter = (): Character => {
  return {
    id: faker.datatype.number(),
    accessToken: faker.datatype.string(),
    refreshToken: faker.datatype.string(),
    birthday: faker.date.birthdate(),
    name: faker.name.fullName(),
    esiId: faker.datatype.number(),
    gender: faker.name.gender(),
    corporationId: faker.datatype.number(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    tokenExpiresAt: faker.date.future().getDate(),
    allianceId: faker.datatype.number(),
    description: faker.lorem.text(),
    ancestryId: faker.datatype.number(),
    bloodlineId: faker.datatype.number(),
    factionId: faker.datatype.number(),
    raceId: faker.datatype.number(),
    ownerId: faker.datatype.number(),
    title: faker.name.jobTitle(),
    totalSp: faker.datatype.number(),
    scopes: faker.datatype.string(),
    securityStatus: new Prisma.Decimal(faker.datatype.float()),
  }
}