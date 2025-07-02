import { z } from "zod";
import prisma from "@/lib/prisma";

import { inngest } from "@/app/inngest/client";
import { generateSlug } from "random-word-slugs";
import { baseProcedure, createTRPCRouter } from "@/app/trpc/init";

export const projectsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  }),
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Project name is required" })
          .max(1000, {
            message: "Project name must be less than 1000 characters",
          }),
      })
    )
    .mutation(async ({ input }) => {
      const createProject = await prisma.project.create({
        data: {
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createProject.id,
        },
      });

      return createProject;
    }),
});
