"use client";

import { PricingTable } from "@shared/components/PricingTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/components/dialog";
import { useTranslations } from "next-intl";
import type { Purchases } from "../../../shared/types";

export function UpgradePlanDialog({
  purchases,
  open,
  onOpenChange,
}: {
  purchases?: Purchases | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {t("settings.billing.subscription.upgradePlan")}
          </DialogTitle>
        </DialogHeader>

        <PricingTable purchases={purchases} />
      </DialogContent>
    </Dialog>
  );
}
