import type { PurchaseTypeType, SubscriptionStatusType } from "database";

export type CreateCheckoutLink = (params: {
  type: PurchaseTypeType;
  priceId: string;
  email?: string;
  name?: string;
  userId?: string;
  teamId?: string;
  redirectUrl?: string;
}) => Promise<string | null>;

export type CreateCustomerPortalLink = (params: {
  customerId: string;
  redirectUrl?: string;
}) => Promise<string | null>;

export type PauseSubscription = (params: { id: string }) => Promise<void>;

export type CancelSubscription = (params: { id: string }) => Promise<void>;

export type ResumeSubscription = (params: { id: string }) => Promise<{
  status: SubscriptionStatusType;
}>;

export type WebhookHandler = (req: Request) => Promise<Response>;
