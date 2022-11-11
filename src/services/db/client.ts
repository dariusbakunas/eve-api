import { PrismaClient } from '@prisma/client'

export const createClient = (url: string) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      }
    }
  });

  return prisma;
}
