import { currentUser } from "@saas/auth/lib/current-user";
import { getApiCaller } from "@shared/lib/api-caller";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
	const url = new URL(request.url);
	const code = url.searchParams.get("code");

	if (!code) {
		redirect("/");
	}

	const apiCaller = await getApiCaller();
	const { user } = await currentUser();

	const invitation = await apiCaller.team.invitationById({
		id: code,
	});

	if (!invitation) {
		redirect("/");
	}

	if (!user) {
		return redirect(
			`/auth/login?invitationCode=${invitation.id}&email=${encodeURIComponent(
				invitation.email,
			)}`,
		);
	}

	const team = await apiCaller.team.acceptInvitation({
		id: code,
	});

	if (!team) {
		redirect("/");
	}

	return redirect("/app/dashboard");
}
