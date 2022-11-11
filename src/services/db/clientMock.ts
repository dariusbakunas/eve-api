import type { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { createClient } from './client'

jest.mock('./client', () => ({
  __esModule: true,
  createClient: (_: string) => mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

const client = createClient("TEST_URL");
export const prismaMock = client as unknown as DeepMockProxy<PrismaClient>