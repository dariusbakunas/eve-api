import { PrismaClient } from "prisma/prisma-client/scripts/default-index";

export interface IDataSources {
  db: PrismaClient,
}

export const dataSources = () => {
  const dataSources: IDataSources = {
    db: new PrismaClient(),
  };

  return dataSources;
}
