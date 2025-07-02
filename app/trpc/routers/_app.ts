import { projectsRouter } from "@/app/modules/projects/server/procedures";
import { createTRPCRouter } from "../init";
import { messageRouter } from "@/app/modules/messages/server/procedures";

export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;