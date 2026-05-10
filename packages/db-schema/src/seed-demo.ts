import { PrismaClient, Role, TxStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDemo() {
  console.log('🚀 Seeding demo environment...');

  // 1. Create Demo Users
  const elder = await prisma.user.upsert({
    where: { email: 'elder@example.com' },
    update: {},
    create: {
      email: 'elder@example.com',
      role: Role.USER,
    },
  });

  const caregiver = await prisma.user.upsert({
    where: { email: 'caregiver@example.com' },
    update: {},
    create: {
      email: 'caregiver@example.com',
      role: Role.ADMIN,
    },
  });

  // 2. Create Mock Medical Requests
  await prisma.medicalRecord.create({
    data: {
      userId: elder.id,
      documentType: 'Medication Update',
      encryptedData: 'ipfs://mock-cid-encrypted-123',
    },
  });

  // 3. Create Demo Transaction History
  await prisma.transaction.create({
    data: {
      userId: elder.id,
      amount: 250.5,
      signature: '5H8V9...' + Math.random().toString(36).substring(7),
      status: TxStatus.CONFIRMED,
    },
  });

  console.log('✅ Demo environment seeded successfully!');
}

seedDemo()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
