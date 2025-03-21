import { PurchaseOverview } from "@saas/settings/components/PurchaseOverview";
import { CURRENT_TEAM_ID_COOKIE_NAME } from "@saas/shared/constants";
import { createApiCaller } from "api/trpc/caller";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations();

  return {
    title: t("settings.billing.title"),
  };
}

export default async function BillingSettingsPage() {
  const apiCaller = await createApiCaller();
  const user = await apiCaller.auth.user();
  const currentTeamId =
    cookies().get(CURRENT_TEAM_ID_COOKIE_NAME)?.value ?? null;

  if (!user) {
    redirect("/auth/login");
  }

  const { teamMemberships } = user;

  const { team } =
    teamMemberships!.find(
      (membership) => membership.team.id === currentTeamId,
    ) ?? teamMemberships![0];

  const purchases = await apiCaller.billing.purchases({
    teamId: team.id,
  });

  return (
    <div>
      <PurchaseOverview purchases={purchases} className="mb-4" />
    </div>
  );
}
