import { PrismaClient } from '@prisma/client'

export interface IDataSources {
  db: PrismaClient,
}

export const dataSources = () => {
  const dataSources: IDataSources = {
    db: new PrismaClient(),
  };

  return dataSources;
}
