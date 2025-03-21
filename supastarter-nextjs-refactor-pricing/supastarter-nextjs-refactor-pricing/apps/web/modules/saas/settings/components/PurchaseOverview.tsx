"use client";

import { ActionBlock } from "@saas/shared/components/ActionBlock";
import { useProductInformation } from "@shared/hooks/product-information";
import { Button } from "@ui/components/button";
import { products } from "billing/products";
import { StarIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import type { Purchases } from "../../../shared/types";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";
import { UpgradePlanDialog } from "./UpgradePlanDialog";

export function PurchaseOverview({
  purchases,
  className,
}: {
  purchases?: Purchases;
  className?: string;
}) {
  const format = useFormatter();
  const t = useTranslations();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  const productInformation = useProductInformation();

  return (
    <ActionBlock title={t("settings.billing.title")} className={className}>
      {purchases?.map((purchase) => {
        const product = products.find(
          (product) => product.priceId === purchase.priceId,
        );

        if (!product) {
          return null;
        }

        const { title } = productInformation[product.referenceId];

        return (
          <div
            className="flex items-center gap-2 rounded-lg bg-accent p-4 text-accent-foreground"
            key={purchase.id}
          >
            <h4 className="text-lg font-bold text-highlight">
              <span>{title}</span>
              <small className="font-normal">
                (
                {format.number(product.price, {
                  style: "currency",
                  currency: product.currency,
                })}
                {product.type === "subscription" && (
                  <span>
                    /
                    {t(
                      `settings.billing.subscription.${product.interval}` as never,
                    )}
                    )
                  </span>
                )}
              </small>
            </h4>
            {purchase?.status && (
              <SubscriptionStatusBadge status={purchase.status} />
            )}
          </div>
        );
      })}

      {!purchases?.length && (
        <div>
          <div className="rounded-lg bg-highlight/10 p-4">
            <div className="flex gap-2">
              <StarIcon className="size-8 text-highlight" />
              <div className="flex flex-col items-start">
                <h4 className="text-xl font-semibold text-highlight">
                  {t("settings.billing.freePlan.title")}
                </h4>
                <p className="text-sm">
                  {t("settings.billing.freePlan.description")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              variant="primary"
              className="mt-3"
              onClick={() => setUpgradeDialogOpen(true)}
            >
              {t("settings.billing.freePlan.upgrade")}
            </Button>
          </div>
        </div>
      )}

      {/* {currentSubscription?.nextPaymentDate && (
        <p className="mt-1 text-muted-foreground">
          {t.rich(
            currentSubscription.status === "CANCELED" ||
              currentSubscription.status === "PAUSED"
              ? "settings.billing.subscription.endsOn"
              : "settings.billing.subscription.nextPayment",
            {
              nextPaymentDate: currentSubscription.nextPaymentDate,
              strong: (text) => <strong>{text}</strong>,
            },
          )}
        </p>
      )} */}

      {/* {currentSubscription && (
        <div className="-mx-6 -mb-6 mt-6 flex justify-end border-t px-6 py-3">
          <div className="flex w-full flex-col justify-between gap-3 md:flex-row">
            <div>
              {currentSubscription && (
                <CustomerPortalButton purchaseId={currentSubscription.id} />
              )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              {(currentSubscription.status === "ACTIVE" ||
                currentSubscription.status === "TRIALING") && (
                <>
                  <CancelSubscriptionButton
                    id={currentSubscription.id}
                    label={t("settings.billing.subscription.cancel")}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )} */}

      <UpgradePlanDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
      />
    </ActionBlock>
  );
}
