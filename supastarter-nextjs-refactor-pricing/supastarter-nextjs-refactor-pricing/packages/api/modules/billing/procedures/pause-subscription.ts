import { TRPCError } from "@trpc/server";
import { pauseSubscription as pauseSubscriptionResolver } from "billing";
import { PurchaseTypeSchema, db } from "database";
import { logger } from "logs";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const pauseSubscription = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ input: { id }, ctx: { abilities, user } }) => {
    const purchase = await db.purchase.findFirst({
      where: {
        id,
      },
    });

    if (!purchase || purchase.type !== PurchaseTypeSchema.Values.SUBSCRIPTION) {
      throw new TRPCError({
        code: "NOT_FOUND",
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
      await pauseSubscriptionResolver({ id });

      await db.purchase.update({
        where: {
          id,
        },
        data: {
          status: "PAUSED",
        },
      });
    } catch (e) {
      logger.error(e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
