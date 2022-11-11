import type { DeepMockProxy } from 'jest-mock-extended';
import type { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import type { ContextUser } from '../auth/getUser';

export type MockContext = {
  dataSources: {
    db: DeepMockProxy<PrismaClient>
  },
  user: ContextUser;
}

export const mockContext = (): MockContext => {
  return {
    dataSources: {
      db: mockDeep<PrismaClient>()
    },
    user: {
      id: 1,
      email: 'test@gmail.com',
      username: 'testuser',
      status: 'ACTIVE'
    }
  }
}