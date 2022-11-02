import { PrismaClient } from '@prisma/client'

export interface IDataSources {
  db: PrismaClient,
}

export const dataSources = (dbURL: string) => {
  const dataSources: IDataSources = {
    db: new PrismaClient({
      datasources: {
        db: {
          url: dbURL,
        }
      }
    }),
  };

  return dataSources;
}
