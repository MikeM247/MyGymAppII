import { prisma } from "../lib/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  },
  create(data: { email: string; name: string; passwordHash: string }) {
    return prisma.user.create({ data });
  }
};
