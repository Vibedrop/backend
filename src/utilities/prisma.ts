import { PrismaClient, type User } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma, type User };
