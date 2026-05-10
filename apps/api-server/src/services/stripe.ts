import Stripe from "stripe";
import { logger } from "../utils/logger";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-04-10",
    });
  }

  async createCheckoutSession(userId: string, amount: number, currency = "usd") {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: "Emergency Top-up",
                description: "Fallback fiat payment for InkTrust caregiving services",
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancel`,
        metadata: { userId },
      });

      return session;
    } catch (error) {
      logger.error({ err: error, userId }, "Failed to create Stripe checkout session");
      throw error;
    }
  }

  async validateWebhook(payload: string | Buffer, signature: string, endpointSecret: string) {
    try {
      return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (error) {
      logger.error({ err: error }, "Stripe webhook validation failed");
      throw error;
    }
  }

  async handleSubscriptionUpdated(subscriptionId: string) {
    // Logic for updating caregiver subscription status
    logger.info({ subscriptionId }, "Handling Stripe subscription update");
  }
}

export const stripeService = new StripeService();
