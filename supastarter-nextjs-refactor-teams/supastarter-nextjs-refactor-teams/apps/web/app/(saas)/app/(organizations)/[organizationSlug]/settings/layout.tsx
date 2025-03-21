import { config } from "@repo/config";
import { getActiveOrganization } from "@saas/auth/lib/server";
import { OrganizationLogo } from "@saas/organizations/components/OrganizationLogo";
import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";
import { CreditCardIcon, Settings2Icon, Users2Icon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export default async function SettingsLayout({
	children,
	params,
}: PropsWithChildren<{
	params: Promise<{ organizationSlug: string }>;
}>) {
	const t = await getTranslations();
	const { organizationSlug } = await params;
	const organization = await getActiveOrganization(organizationSlug);

	if (!organization) {
		redirect("/app");
	}

	const organizationSettingsBasePath = `/app/${organizationSlug}/settings`;

	const menuItems = [
		{
			title: t("settings.menu.organization.title"),
			avatar: (
				<OrganizationLogo
					name={organization.name}
					logoUrl={organization.logo}
				/>
			),
			items: [
				{
					title: t("settings.menu.organization.general"),
					href: `${organizationSettingsBasePath}/general`,
					icon: <Settings2Icon className="size-4 opacity-50" />,
				},
				{
					title: t("settings.menu.organization.members"),
					href: `${organizationSettingsBasePath}/members`,
					icon: <Users2Icon className="size-4 opacity-50" />,
				},
				...(config.organizations.enableBilling
					? [
							{
								title: t("settings.menu.organization.billing"),
								href: `${organizationSettingsBasePath}/billing`,
								icon: <CreditCardIcon className="size-4 opacity-50" />,
							},
						]
					: []),
			],
		},
	];

	return (
		<>
			<PageHeader
				title={t("organizations.settings.title")}
				subtitle={t("organizations.settings.subtitle")}
			/>
			<SidebarContentLayout sidebar={<SettingsMenu menuItems={menuItems} />}>
				{children}
			</SidebarContentLayout>
		</>
	);
}
