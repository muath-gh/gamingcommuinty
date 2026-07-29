import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// ✅ Singleton - يتم إنشاء instance واحد فقط
const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb({
    host: process.env.db_host || "127.0.0.1",
    port: parseInt(process.env.db_port || "3306"),
    database: process.env.db_name || "gaming_community",
    user: process.env.db_user || "root",
    password: process.env.db_password || "",
    connectionLimit: 20, // ✅ زيادة للـ production
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// ✅ استخدم الـ global بدل local
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
