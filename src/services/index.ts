import { PrismaClient } from "prisma/prisma-client/scripts/default-index";
import {DataSources} from "apollo-server-core/dist/graphqlOptions";

export interface IDataSources extends DataSources<object> {
  db: PrismaClient,
}

export const dataSources = () => {
  const dataSources: IDataSources = {
    db: new PrismaClient(),
  };

  return dataSources;
}
