import { TRPCError } from "@trpc/server";
import type { Purchase } from "database";
import { PurchaseSchema, db } from "database";
import { logger } from "logs";
import { publicProcedure } from "../../../trpc/base";

export const syncPurchase = publicProcedure
  .input(PurchaseSchema)
  .mutation(async ({ input, ctx: { isAdmin } }) => {
    // this procedure can only be called by the admin caller from a webhook
    if (!isAdmin) {
      throw new TRPCError({
        code: "FORBIDDEN",
      });
    }

    let existingPurchase: Purchase | null = null;

    if (input?.teamId) {
      existingPurchase = await db.purchase.findFirst({
        where: {
          teamId: input.teamId,
        },
      });
    }

    try {
      const { id, ...rest } = input;
      await db.purchase.upsert({
        create: input,
        update: rest,
        where: {
          id,
        },
      });
    } catch (e) {
      logger.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  });
