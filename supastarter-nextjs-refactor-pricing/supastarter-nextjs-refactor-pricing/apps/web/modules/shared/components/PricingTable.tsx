"use client";

import { useUser } from "@saas/auth/hooks/use-user";
import { useProductInformation } from "@shared/hooks/product-information";
import { apiClient } from "@shared/lib/api-client";
import type { Purchases } from "@shared/types";
import { Button } from "@ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/tabs";
import { useToast } from "@ui/hooks/use-toast";
import { cn } from "@ui/lib";
import { products } from "billing/products";
import { CheckIcon, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function PricingTable({
  purchases,
  className,
}: {
  purchases?: Purchases | null;
  className?: string;
}) {
  const t = useTranslations();
  const { toast } = useToast();
  const { teamMembership } = useUser();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const createCheckoutLinkMutation =
    apiClient.billing.createCheckoutLink.useMutation();

  const productInformation = useProductInformation();

  const sortedProducts = products.sort((a, b) => {
    return a.price - b.price;
  });

  const hasSubscriptions = sortedProducts.some(
    (product) => product.type === "subscription",
  );

  const filteredProducts = sortedProducts.filter(
    (product) => !("interval" in product) || product.interval === interval,
  );

  const onSelectPlan = async (priceId: string) => {
    try {
      const checkoutUrl = await createCheckoutLinkMutation.mutateAsync({
        type:
          products.find((product) => product.priceId === priceId)?.type ===
          "one-time"
            ? "ONE_TIME"
            : "SUBSCRIPTION",
        priceId: priceId,
        teamId: teamMembership?.teamId,
        redirectUrl: window.location.href,
      });

      window.location.href = checkoutUrl;
    } catch {
      toast({
        title: t("pricing.checkoutLinkError"),
        variant: "error",
      });
    }
  };

  const purchasedProducts = products?.filter((product) =>
    purchases?.some((purchase) => purchase.priceId === product.priceId),
  );

  const isActiveProduct = (
    referenceId: (typeof products)[number]["referenceId"],
  ) => {
    return purchasedProducts?.some(
      (purchase) => purchase.referenceId === referenceId,
    );
  };

  return (
    <div className={cn(className, "@container")}>
      {hasSubscriptions && (
        <div className="mb-6 flex justify-end">
          <Tabs
            value={interval}
            onValueChange={(value) => setInterval(value as typeof interval)}
            data-test="price-table-interval-tabs"
          >
            <TabsList>
              <TabsTrigger value="month">{t("pricing.monthly")}</TabsTrigger>
              <TabsTrigger value="year">{t("pricing.yearly")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="grid gap-4 @2xl:grid-cols-3">
        {filteredProducts.map((product) => {
          const { title, description, features, recommended } =
            productInformation[product.referenceId];

          return (
            <div
              key={product.referenceId}
              className={cn("rounded-xl bg-card p-6 shadow-md", {
                "border-highlight border-2": recommended,
              })}
              data-test="price-table-plan"
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  {recommended && (
                    <div className="-mt-9 flex justify-center">
                      <div className="mb-2 flex h-6 w-auto items-center gap-1.5 rounded-full bg-highlight px-2 py-1 text-xs font-semibold text-highlight-foreground">
                        <StarIcon className="size-3" />
                        {t("pricing.recommended")}
                      </div>
                    </div>
                  )}
                  <h3
                    className={cn("mb-4 text-2xl font-semibold", {
                      "text-highlight font-bold": recommended,
                    })}
                  >
                    {title}
                  </h3>
                  {description && (
                    <div className="prose mb-2 text-sm text-foreground/60">
                      {description}
                    </div>
                  )}

                  {!!features?.length && (
                    <ul className="mt-4 grid list-none gap-2 text-sm">
                      {features.map((feature, key) => (
                        <li
                          key={key}
                          className="flex items-center justify-start"
                        >
                          <CheckIcon className="mr-2 size-4 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <strong
                    className="block text-xl font-semibold"
                    data-test="price-table-plan-price"
                  >
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: product.currency,
                    }).format(product.price)}

                    {"interval" in product && (
                      <span className="text-xs font-normal opacity-60">
                        {" / "}
                        {t(
                          interval === "month"
                            ? "pricing.month"
                            : "pricing.year",
                        )}
                      </span>
                    )}
                  </strong>

                  <Button
                    disabled={isActiveProduct(product.referenceId)}
                    loading={selectedPlan === product.referenceId}
                    className="mt-4 w-full"
                    variant="primary"
                    onClick={async () => {
                      setSelectedPlan(product.referenceId);
                      await onSelectPlan(product.priceId);
                      setSelectedPlan(null);
                    }}
                  >
                    {isActiveProduct(product.referenceId)
                      ? t("pricing.currentPlan")
                      : purchasedProducts.length
                        ? t("pricing.switchToPlan")
                        : t(
                            product.type === "one-time"
                              ? "pricing.purchase"
                              : "pricing.subscribe",
                          )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
