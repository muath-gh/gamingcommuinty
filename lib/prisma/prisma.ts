import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
 database:process.env.db_name,
 user:process.env.db_user,
 password:process.env.db_password,
 port:3306,
})

export const prisma = new PrismaClient({ adapter })