import { Purchase, db, type SubscriptionStatusType } from "database";
import { logger } from "logs";
import Stripe from "stripe";
import type {
  CancelSubscription,
  CreateCheckoutLink,
  CreateCustomerPortalLink,
  PauseSubscription,
  ResumeSubscription,
  WebhookHandler,
} from "../../types";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;

  if (!stripeSecretKey) {
    throw new Error("Missing env variable STRIPE_SECRET_KEY");
  }

  stripeClient = new Stripe(stripeSecretKey);

  return stripeClient;
}

export const createCheckoutLink: CreateCheckoutLink = async function ({
  priceId,
  userId,
  teamId,
  redirectUrl,
  email,
  name,
  type,
}) {
  const stripeClient = getStripeClient();

  let customerId: string | undefined;
  if (email) {
    customerId = (
      await stripeClient.customers.create({
        email,
        name,
      })
    ).id;
  }

  const metadata = {
    user_id: userId ?? null,
    team_id: teamId ?? null,
    price_id: priceId ?? null,
  };

  const response = await stripeClient.checkout.sessions.create({
    mode: type === "ONE_TIME" ? "payment" : "subscription",
    success_url: redirectUrl ?? "",
    line_items: [
      {
        quantity: 1,
        price: priceId,
      },
    ],
    customer: customerId,
    ...(type === "ONE_TIME"
      ? {
          payment_intent_data: {
            metadata,
          },
        }
      : {
          subscription_data: {
            metadata,
          },
        }),
  });

  return response.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
  customerId,
  redirectUrl,
}) => {
  const stripeClient = getStripeClient();

  const response = await stripeClient.billingPortal.sessions.create({
    customer: customerId,
    return_url: redirectUrl ?? "",
  });

  return response.url;
};

export const pauseSubscription: PauseSubscription = async ({ id }) => {
  const stripeClient = getStripeClient();

  await stripeClient.subscriptions.update(id, {
    pause_collection: {
      behavior: "void",
    },
  });
};

export const cancelSubscription: CancelSubscription = async ({ id }) => {
  const stripeClient = getStripeClient();

  await stripeClient.subscriptions.cancel(id);
};

export const resumeSubscription: ResumeSubscription = async ({ id }) => {
  const stripeClient = getStripeClient();

  const response = await stripeClient.subscriptions.resume(id, {
    billing_cycle_anchor: "unchanged",
  });

  return {
    status: response.status as SubscriptionStatusType,
  };
};

export const webhookHandler: WebhookHandler = async (req) => {
  const stripeClient = getStripeClient();

  if (!req.body) {
    return new Response("Invalid request.", {
      status: 400,
    });
  }

  let event: Stripe.Event | undefined;

  try {
    event = await stripeClient.webhooks.constructEventAsync(
      await req.text(),
      req.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (e) {
    logger.error(e);
    return new Response("Invalid request.", {
      status: 400,
    });
  }

  if (
    ![
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "payment_intent.succeeded",
    ].includes(event.type)
  ) {
    return new Response("Unhandled event type.", {
      status: 200,
    });
  }

  const { object } = event.data;

  if (object.object === "subscription") {
    const { id, metadata, status, customer, items, current_period_end } =
      object;

    const statusMap: Record<string, SubscriptionStatusType> = {
      active: "ACTIVE",
      past_due: "PAST_DUE",
      unpaid: "UNPAID",
      canceled: "CANCELED",
      incomplete: "INCOMPLETE",
      incomplete_expired: "EXPIRED",
      trialing: "TRIALING",
      paused: "PAUSED",
    };

    const subscription = {
      id,
      teamId: metadata?.team_id,
      userId: metadata?.user_id,
      status: statusMap[status],
      customerId: customer as string,
      type: "SUBSCRIPTION",
      nextPaymentDate: new Date(current_period_end * 1000),
      priceId: items.data[0].price.id,
    } satisfies Purchase;

    await db.purchase.upsert({
      create: subscription,
      update: subscription,
      where: {
        id,
      },
    });
  } else if (object.object === "payment_intent") {
    const { id, customer, metadata, } = object;

    const priceId = 

    const purchase = {
      id,
      customerId: customer as string,
      type: "ONE_TIME",
      teamId: metadata?.team_id,
      userId: metadata?.user_id,
      nextPaymentDate: null,
      priceId: metadata!.price_id,
      status: null,
    } satisfies Purchase;

    await db.purchase.upsert({
      create: purchase,
      update: purchase,
      where: {
        id,
      },
    });
  }

  return new Response(null, { status: 200 });
};
