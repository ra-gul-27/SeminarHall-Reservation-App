import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'IFETHALL';
  const password = 'IFET811111';
  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password_hash },
    create: {
      email,
      password_hash,
      role: 'ADMIN',
    },
  });

  const adminEmail = 'ADMIN5';
  const adminPassword = 'IFET001';
  const admin_password_hash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password_hash: admin_password_hash },
    create: {
      email: adminEmail,
      password_hash: admin_password_hash,
      role: 'ADMIN',
    },
  });

  const halls = [
    { id: 'main', name: 'MT Seminar Hall', capacity: 100, features: [] },
    { id: 'mini', name: 'Lib Seminar Hall', capacity: 50, features: [] },
    { id: 'meeting', name: 'Meeting Hall', capacity: 20, features: [] }
  ];

  for (const hall of halls) {
    await prisma.hall.upsert({
      where: { id: hall.id },
      update: hall,
      create: hall,
    });
  }

  console.log({ user, halls });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
