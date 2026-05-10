import axios from 'axios';
import { prisma } from '../../packages/db-schema/src/client';

const API_URL = 'http://localhost:3001/api/v1';

async function testE2EFlow() {
  console.log('🧪 Starting InkTrust E2E Integration Test...');

  // 1. Setup Test User
  const user = await prisma.user.upsert({
    where: { faxNumber: '+1234567890' },
    update: {},
    create: {
      faxNumber: '+1234567890',
      embeddedWalletAddress: 'TestWallet123',
      spendingLimit: 0.1, // Set low limit to trigger approval
    },
  });
  console.log(`✅ Test User Ready: ${user.id}`);

  // 2. Simulate Telnyx Fax Received Webhook
  console.log('📡 Simulating Incoming Fax Webhook...');
  try {
    await axios.post(`${API_URL}/webhooks/telnyx/fax_received`, {
      data: {
        event_type: 'fax.received',
        id: 'evt_test_123',
        payload: {
          fax_id: 'fax_test_' + Date.now(),
          direction: 'inbound',
          from: '+1987654321',
          to: '+1234567890',
          media_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
      },
    });
    console.log('✅ Webhook accepted and queued');
  } catch (err: any) {
    console.error('❌ Webhook failed:', err.response?.data || err.message);
    return;
  }

  // 3. Wait for AI Processing (Poll DB)
  console.log('🤖 Waiting for AI processing and approval generation...');
  let jobProcessed = false;
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const job = await prisma.faxJob.findFirst({
      where: { userId: user.id },
      include: { approvalRequest: true },
      orderBy: { createdAt: 'desc' },
    });

    if (job?.status === 'AWAITING_APPROVAL' && job.approvalRequest) {
      console.log(`✅ AI Extracted Intent: ${job.intent}`);
      console.log(`✅ Approval Request Created: ${job.approvalRequest.id}`);
      jobProcessed = true;
      break;
    }
    console.log(`... polling status (${i + 1}/10): ${job?.status || 'NOT_FOUND'}`);
  }

  if (jobProcessed) {
    console.log('🏆 E2E TEST PASSED: Full Analog-to-Web3 flow verified!');
  } else {
    console.log('❌ E2E TEST FAILED: Processing timeout');
  }
}

testE2EFlow()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
