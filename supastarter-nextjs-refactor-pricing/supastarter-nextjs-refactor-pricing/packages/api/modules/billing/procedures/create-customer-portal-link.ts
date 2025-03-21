import { TRPCError } from "@trpc/server";
import { createCustomerPortalLink as createCustomerPortalLinkResolver } from "billing";
import { db } from "database";
import { logger } from "logs";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const createCustomerPortalLink = protectedProcedure
  .input(
    z.object({
      purchaseId: z.string(),
      redirectUrl: z.string().optional(),
    }),
  )
  .output(z.string())
  .mutation(
    async ({
      input: { purchaseId, redirectUrl },
      ctx: { abilities, user },
    }) => {
      const purchase = await db.purchase.findFirst({
        where: {
          id: purchaseId,
        },
      });

      if (!purchase) {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }

      if (
        (purchase.teamId && !abilities.isTeamOwner(purchase.teamId)) ||
        purchase.userId !== user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      try {
        const customerPortalLink = await createCustomerPortalLinkResolver({
          customerId: purchase.customerId,
          redirectUrl,
        });

        if (!customerPortalLink) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return customerPortalLink;
      } catch (e) {
        logger.error(e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    },
  );
