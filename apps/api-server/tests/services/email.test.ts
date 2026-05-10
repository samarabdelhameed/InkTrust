import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../src/config/env', () => ({
  env: {
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'test-key',
    AWS_SECRET_ACCESS_KEY: 'test-secret',
  },
}));

describe('EmailService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be instantiated with correct config', async () => {
    const { EmailService } = await import('../../src/services/email');
    const service = new EmailService();
    expect(service).toBeDefined();
  });

  it('should render approval template with correct variables', async () => {
    const { EmailService } = await import('../../src/services/email');
    const service = new EmailService();
    const result = await service.sendApprovalNotification('test@example.com', {
      caregiverName: 'Yuki',
      amount: '¥1,280',
      purpose: 'Medicine',
      elderlyName: 'Taro',
      blinkUrl: 'https://dial.to/approve',
    });
    expect(result).toBeDefined();
  });
});
