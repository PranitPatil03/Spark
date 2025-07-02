import { createTRPCRouter } from "../init";
import { messageRouter } from "@/app/modules/messages/server/procedures";

export const appRouter = createTRPCRouter({
  messages: messageRouter,
});

export type AppRouter = typeof appRouter;