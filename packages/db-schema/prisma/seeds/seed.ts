import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create System User
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@inktrust.io' },
    update: {},
    create: {
      email: 'system@inktrust.io',
      role: Role.SYSTEM,
    },
  });

  console.log({ systemUser });

  // Add initial sponsor record
  const initialSponsor = await prisma.sponsorPayment.create({
    data: {
      sponsorName: 'Solana Foundation',
      amount: 5000,
      currency: 'USDC',
      status: 'CONFIRMED',
    },
  });

  console.log({ initialSponsor });
  
  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
