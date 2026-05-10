import Stripe from "stripe";
import { logger } from "../utils/logger";
import { emailService } from "./email";

export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-04-10",
    });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  }

  async createCheckoutSession(userId: string, amount: number, currency = "jpy") {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: "InkTrust Emergency Top-up",
            description: "Fallback fiat payment for caregiving services",
          },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancel`,
      metadata: { userId },
    });
    logger.info({ userId, sessionId: session.id }, "Stripe checkout session created");
    return session;
  }

  async createSubscription(caregiverEmail: string, priceId: string) {
    const customer = await this.stripe.customers.create({ email: caregiverEmail });
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    logger.info({ customerId: customer.id, subscriptionId: subscription.id }, "Subscription created");
    return subscription;
  }

  async createInvoice(customerId: string, amount: number, currency = "jpy", description: string) {
    const invoiceItem = await this.stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.round(amount),
      currency,
      description,
    });
    const invoice = await this.stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
    });
    return invoice;
  }

  async validateWebhook(payload: string | Buffer, signature: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        logger.info({ userId, sessionId: session.id, amount: session.amount_total }, "Payment completed");
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        logger.info({ invoiceId: invoice.id, customerId: invoice.customer }, "Invoice paid");
        break;
      }
      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice;
        logger.error({ invoiceId: failedInvoice.id, customerId: failedInvoice.customer }, "Invoice payment failed");
        if (failedInvoice.customer_email) {
          await emailService.sendEmail(
            failedInvoice.customer_email,
            "Payment Failed — InkTrust",
            "<p>Your recent payment could not be processed. Please update your payment method.</p>"
          );
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        logger.warn({ subscriptionId: sub.id }, "Subscription cancelled");
        break;
      }
      default:
        logger.debug({ type: event.type }, "Unhandled Stripe webhook event");
    }
  }

  async reconcilePayment(sessionId: string, txSignature: string) {
    logger.info({ sessionId, txSignature }, "Reconciling Stripe payment with Solana transaction");
  }

  async cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }
}

export const stripeService = new StripeService();
