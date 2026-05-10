import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('stripe', () => {
  const mockStripe = vi.fn(() => ({
    checkout: { sessions: { create: vi.fn().mockResolvedValue({ id: 'cs_test', url: 'https://checkout.stripe.com' }) } },
    customers: { create: vi.fn().mockResolvedValue({ id: 'cus_test' }) },
    subscriptions: { create: vi.fn().mockResolvedValue({ id: 'sub_test' }), cancel: vi.fn() },
    invoices: { create: vi.fn().mockResolvedValue({ id: 'in_test' }) },
    invoiceItems: { create: vi.fn() },
    webhooks: { constructEvent: vi.fn().mockReturnValue({ type: 'checkout.session.completed', data: { object: {} } }) },
  }));
  return { default: mockStripe };
});

describe('StripeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';
  });

  it('should create checkout session', async () => {
    const { StripeService } = await import('../../src/services/stripe');
    const service = new StripeService();
    const session = await service.createCheckoutSession('user-1', 5000);
    expect(session.id).toBe('cs_test');
  });

  it('should validate webhook', async () => {
    const { StripeService } = await import('../../src/services/stripe');
    const service = new StripeService();
    const event = await service.validateWebhook('{}', 'sig');
    expect(event.type).toBe('checkout.session.completed');
  });

  it('should handle webhook events', async () => {
    const { StripeService } = await import('../../src/services/stripe');
    const service = new StripeService();
    await expect(service.handleWebhook({ type: 'checkout.session.completed', data: { object: { metadata: { userId: 'u1' } } } } as any)).resolves.not.toThrow();
  });
});
