import { PurchaseSchema, db } from "database";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";

export const purchases = protectedProcedure
  .input(
    z.union([
      z.object({
        teamId: z.string(),
      }),
      z.object({
        userId: z.string(),
      }),
    ]),
  )
  .output(z.array(PurchaseSchema).nullable())
  .query(async ({ input, ctx: { abilities } }) => {
    if ("teamId" in input && !abilities.isTeamMember(input.teamId)) {
      throw new Error("Unauthorized");
    }

    const purchases = await db.purchase.findMany({
      where: input,
    });

    return purchases;
  });
