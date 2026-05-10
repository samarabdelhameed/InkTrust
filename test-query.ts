import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const j = await prisma.faxJob.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(JSON.stringify(j, null, 2));
}
main().finally(() => prisma.$disconnect());
