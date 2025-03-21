import { createClient } from "@supabase/supabase-js";
import { logger } from "logs";
import type {
	GetSignedUploadUrlHandler,
	GetSignedUrlHander,
} from "../../types";

let supabaseClient: ReturnType<typeof createClient> | null = null;
const getSupabaseAdminClient = () => {
	if (supabaseClient) {
		return supabaseClient;
	}

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
	if (!supabaseUrl) {
		throw new Error("Missing env variable NEXT_PUBLIC_SUPABASE_URL");
	}

	const supabaseServiceRoleKey = process.env
		.SUPABASE_SERVICE_ROLE_KEY as string;
	if (!supabaseServiceRoleKey) {
		throw new Error("Missing env variable SUPABASE_SERVICE_ROLE_KEY");
	}

	supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

	return supabaseClient;
};

export const getSignedUploadUrl: GetSignedUploadUrlHandler = async (
	path,
	{ bucket },
) => {
	const supabaseClient = getSupabaseAdminClient();
	const { data, error } = await supabaseClient.storage
		.from(bucket)
		.createSignedUploadUrl(path);

	if (error) {
		logger.error(error);
		throw new Error("Could not get signed url");
	}

	return data.signedUrl;
};

export const getSignedUrl: GetSignedUrlHander = async (
	path,
	{ bucket, expiresIn },
) => {
	const supabaseClient = getSupabaseAdminClient();
	const { data, error } = await supabaseClient.storage
		.from(bucket)
		.createSignedUrl(path, expiresIn ?? 60);

	if (error) {
		logger.error(error);
		throw new Error("Could not get signed url");
	}

	return data.signedUrl;
};
