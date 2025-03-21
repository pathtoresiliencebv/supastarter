import { TRPCError } from "@trpc/server";
import { createCheckoutLink as createCheckoutLinkResolver } from "billing";
import { PurchaseTypeSchema } from "database";
import { logger } from "logs";
import { z } from "zod";
import { publicProcedure } from "../../../trpc/base";

export const createCheckoutLink = publicProcedure
  .input(
    z.object({
      type: PurchaseTypeSchema,
      priceId: z.string(),
      userId: z.string().optional(),
      teamId: z.string().optional(),
      redirectUrl: z.string().optional(),
    }),
  )
  .output(z.string())
  .mutation(
    async ({
      input: { priceId, redirectUrl, teamId, userId, type },
      ctx: { user },
    }) => {
      try {
        const checkoutLink = await createCheckoutLinkResolver({
          type,
          priceId,
          email: user?.email,
          name: user?.name,
          teamId,
          userId,
          redirectUrl,
        });

        if (!checkoutLink) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return checkoutLink;
      } catch (e) {
        logger.error(e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  );
