import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed-Audit] Seeding audit logs...');

  const users = await prisma.user.findMany({ take: 1 });
  if (users.length === 0) {
    console.log('[Seed-Audit] No users found, skipping');
    return;
  }

  const faxRequests = await prisma.faxRequest.findMany({ take: 1 });

  const auditEntries = [
    { action: 'FAX_RECEIVED', resource: 'fax_request', details: { from: '+81-50-0000-0002' } },
    { action: 'AI_PROCESSING_STARTED', resource: 'fax_request', details: { model: 'gemini-2.0-flash' } },
    { action: 'INTENT_EXTRACTED', resource: 'fax_request', details: { confidence: 0.94 } },
    { action: 'APPROVAL_REQUESTED', resource: 'fax_request', details: { approver: 'Yuki Tanaka' } },
    { action: 'APPROVED', resource: 'fax_request', details: { method: 'blink' } },
    { action: 'EXECUTED', resource: 'fax_request', details: { amount: 1280 } },
  ];

  for (const entry of auditEntries) {
    await prisma.auditLog.create({
      data: {
        actorId: users[0].id,
        faxRequestId: faxRequests[0]?.id,
        action: entry.action,
        resource: entry.resource,
        details: entry.details,
      },
    });
  }

  console.log(`[Seed-Audit] Created ${auditEntries.length} audit log entries`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
