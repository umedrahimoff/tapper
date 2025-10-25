// Mock Prisma client for now
export const prisma = {
  user: {
    findUnique: async (args: any) => null,
    findFirst: async (args: any) => null,
    create: async (args: any) => ({ id: '1', ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async (args: any) => ({ id: args.where.id }),
    findMany: async (args: any) => [],
  },
  link: {
    findMany: async (args: any) => [],
    create: async (args: any) => ({ id: '1', ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async (args: any) => ({ id: args.where.id }),
  },
  $transaction: async (operations: any[]) => {
    for (const op of operations) {
      await op()
    }
  }
}
