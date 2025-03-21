import type { Webhook } from "@lemonsqueezy/lemonsqueezy.js";
import {
  createCheckout,
  getCustomer,
  lemonSqueezySetup,
  cancelSubscription as lsCancelSubscription,
  updateSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";
import { createHmac, timingSafeEqual } from "crypto";
import type { SubscriptionStatusType } from "database";
import type {
  CancelSubscription,
  CreateCheckoutLink,
  CreateCustomerPortalLink,
  PauseSubscription,
  ResumeSubscription,
} from "../../types";
import {nodejsWebHookHandler} from 'lemonsqueezy-webhooks'

function initLemonsqueezyApi() {
  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  });
}

export const createCheckoutLink: CreateCheckoutLink = async function ({
  priceId,
  email,
  name,
  teamId,
  redirectUrl,
}) {
  initLemonsqueezyApi();

  const response = await createCheckout(
    String(process.env.LEMONSQUEEZY_STORE_ID),
    priceId,
    {
      productOptions: {
        redirectUrl,
        enabledVariants: [parseInt(priceId)],
      },
      checkoutData: {
        email,
        name,
        custom: {
          team_id: teamId,
        },
      },
    },
  );

  return response.data?.data.attributes.url ?? null;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
  customerId,
}) => {
  initLemonsqueezyApi();

  const response = await getCustomer(customerId);

  return response.data?.data.attributes.urls.customer_portal ?? null;
};

export const pauseSubscription: PauseSubscription = async ({ id }) => {
  initLemonsqueezyApi();

  await updateSubscription(id, {
    pause: {
      mode: "free",
    },
  });
};

export const cancelSubscription: CancelSubscription = async ({ id }) => {
  initLemonsqueezyApi();

  await lsCancelSubscription(id);
};

export const resumeSubscription: ResumeSubscription = async ({ id }) => {
  initLemonsqueezyApi();

  const response = await updateSubscription(id, {
    cancelled: false,
  });
  return {
    status: response.data?.data.attributes.status as SubscriptionStatusType,
  };
};

export const webhookHandler = async function (req: Request) {
  initLemonsqueezyApi();

  const res = new Response(null);
  res.body = 

  return await nodejsWebHookHandler({
    secret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
    req,
    onData: async (payload) => {

    }
  })

  // try {
  //   const text = await req.text();
  //   const hmac = createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET!);
  //   const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
  //   const signature = Buffer.from(req.headers.get("x-signature")!, "utf8");

  //   if (!timingSafeEqual(digest, signature)) {
  //     return new Response("Invalid signature.", {
  //       status: 400,
  //     });
  //   }

  //   const payload = JSON.parse(text) as Webhook["data"] | null;

  //   if (!payload) {
  //     return new Response("Invalid payload.", {
  //       status: 400,
  //     });
  //   }

  //   const {
  //     meta: { event_name: eventName, custom_data: customData },
  //     data,
  //   } = payload;

  //   if (!customData?.team_id) {
  //     return new Response("Invalid team ID.", {
  //       status: 400,
  //     });
  //   }

  //   const statusMap: Record<string, SubscriptionStatusType> = {
  //     active: "ACTIVE",
  //     past_due: "PAST_DUE",
  //     unpaid: "UNPAID",
  //     cancelled: "CANCELED",
  //     expired: "EXPIRED",
  //     on_trial: "TRIALING",
  //     paused: "PAUSED",
  //   };

  //   const apiCaller = await createAdminApiCaller();

  //   switch (eventName) {
  //     case "subscription_created":
  //     case "subscription_updated":
  //     case "subscription_cancelled":
  //     case "subscription_expired":
  //     case "subscription_resumed":
  //       // eslint-disable-next-line no-case-declarations
  //       const nextPaymentDate =
  //         data.attributes.trial_ends_at ?? data.attributes.renews_at;

  //       await apiCaller.billing.syncPurchase({
  //         id: String(data.id),
  //         teamId: customData?.team_id,
  //         customerId: String(data.attributes.customer_id),
  //         priceId: String(data.attributes.variant_id),
  //         type: "SUBSCRIPTION",
  //         userId: customData?.user_id ?? null,
  //         status: statusMap[data.attributes.status],
  //         nextPaymentDate: nextPaymentDate ? new Date(nextPaymentDate) : null,
  //       });
  //       break;
  //   }
  // } catch (error: unknown) {
  //   return new Response(
  //     `Webhook error: ${error instanceof Error ? error.message : ""}`,
  //     {
  //       status: 400,
  //     },
  //   );
  // }

  // return new Response(null, {
  //   status: 204,
  // });
};
