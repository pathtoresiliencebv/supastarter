import { PricingTable } from "@shared/components/PricingTable";
import { getTranslations } from "next-intl/server";

export default async function PricingPage() {
  const t = await getTranslations();

  return (
    <main>
      <div className="container pb-16 pt-32">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold lg:text-5xl">
            {t("pricing.title")}
          </h1>
          <p className="mt-3 text-lg opacity-50">{t("pricing.description")}</p>
        </div>

        <PricingTable />
      </div>
    </main>
  );
}
