/* lib/db.js */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

declare global {
  var prisma: PrismaClient;
}

if (!global.prisma) {
  console.log("Creating new Prisma Client");
  global.prisma = new PrismaClient({
    log: ["query"],
  });
} else {
  console.log("Using existing Prisma Client");
}

export default global.prisma;

export const createEdgePrismaClient = () => {
  const neon = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(neon);
  // @ts-ignore
  return new PrismaClient({ adapter });
};
