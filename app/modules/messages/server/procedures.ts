import { z } from "zod";
import prisma from "@/lib/prisma";

import { inngest } from "@/app/inngest/client";
import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";

export const messageRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return messages;
  }),
  create: baseProcedure
    .input(
      z.object({ value: z.string().min(1, { message: "Message is required" }) })
    )
    .mutation(async ({ input }) => {
      const createMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: "USER",
          type: "RESULT",
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
        },
      });

      return createMessage;
    }),
});
