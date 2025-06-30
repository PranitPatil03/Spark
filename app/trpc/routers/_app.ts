import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { inngest } from "@/app/inngest/client";
export const appRouter = createTRPCRouter({
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          value: input.value,
        },
      });
      return { ok: "success" };
    }),
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});

export type AppRouter = typeof appRouter;