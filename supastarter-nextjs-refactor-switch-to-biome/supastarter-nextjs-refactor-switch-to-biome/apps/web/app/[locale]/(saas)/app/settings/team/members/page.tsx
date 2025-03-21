import { currentUser } from "@saas/auth/lib/current-user";
import { InviteMemberForm } from "@saas/settings/components/InviteMemberForm";
import { TeamMembersBlock } from "@saas/settings/components/TeamMembersBlock";
import { getApiCaller } from "@shared/lib/api-caller";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("settings.team.title"),
	};
}

export default async function TeamSettingsPage() {
	const apiCaller = await getApiCaller();
	const { user, team } = await currentUser();

	if (!user || !team) {
		redirect("/auth/login");
	}

	const memberships = await apiCaller.team.memberships({
		teamId: team.id,
	});

	const invitations = await apiCaller.team.invitations({
		teamId: team.id,
	});

	return (
		<div className="grid grid-cols-1 gap-6">
			<InviteMemberForm teamId={team.id} />
			<TeamMembersBlock memberships={memberships} invitations={invitations} />
		</div>
	);
}
