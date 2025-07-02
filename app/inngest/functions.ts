import { inngest } from "./client";
import {
  createAgent,
  createTool,
  createNetwork,
  openai,
  Tool,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompts";
import prisma from "@/lib/prisma";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    try {
      const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("spark-nextjs-dev");
        return sandbox.sandboxId;
      });

      const terminalTool = createTool({
        name: "terminal",
        description: "Run commands in the terminal",
        parameters: z.object({ command: z.string() }),
        handler: async ({ command }, { step }) => {
          return await step?.run("terminal", async () => {
            const buffers = { stdout: "", stderr: "" };

            try {
              const sandbox = await getSandbox(sandboxId);
              const result = await sandbox.commands.run(command, {
                onStdout: (data: string) => {
                  buffers.stdout += data;
                },
                onStderr: (data: string) => {
                  buffers.stderr += data;
                },
              });
              return result.stdout;
            } catch (e) {
              console.error(
                `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
              );

              return `Command failed: ${e} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
            }
          });
        },
      });

      const createOrUpdateFilesTool = createTool({
        name: "createOrUpdateFiles",
        description: "Create or update a file in the sandbox",
        parameters: z.object({
          files: z.array(
            z.object({
              path: z.string(),
              content: z.string(),
            })
          ),
        }),
        handler: async (
          { files },
          { step, network }: Tool.Options<AgentState>
        ) => {
          const newFiles = await step?.run("createOrUpdateFiles", async () => {
            try {
              const updatedFiles = network.state.data.files || {};
              const sandbox = await getSandbox(sandboxId);
              for (const file of files) {
                await sandbox.files.write(file.path, file.content);
                updatedFiles[file.path] = file.content;
              }
              return updatedFiles;
            } catch (e) {
              console.error("ERROR:" + e);
              throw e;
            }
          });

          if (newFiles && typeof newFiles === "object") {
            network.state.data.files = newFiles;
          }
        },
      });

      const readFilesTool = createTool({
        name: "readFiles",
        description: "Read files from the sandbox",
        parameters: z.object({
          files: z.array(z.string()),
        }),
        handler: async ({ files }, { step }) => {
          return await step?.run("readFiles", async () => {
            try {
              const sandbox = await getSandbox(sandboxId);
              const contents = [];
              for (const file of files) {
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }
              return JSON.stringify(contents);
            } catch (e) {
              return `Error reading files: ${e}`;
            }
          });
        },
      });

      const CodeAgent = createAgent<AgentState>({
        name: "code-agent",
        system: PROMPT,
        description: "An expert coding agent",
        model: openai({ model: "gpt-4.1" }),
        tools: [terminalTool, createOrUpdateFilesTool, readFilesTool],
        lifecycle: {
          onResponse: async ({ result, network }) => {
            const lastAssistantTextMessage =
              lastAssistantTextMessageContent(result);

            if (lastAssistantTextMessage && network) {
              if (lastAssistantTextMessage.includes("<task_summary>")) {
                network.state.data.summary = lastAssistantTextMessage;
              }
            }
            return result;
          },
        },
      });

      const network = createNetwork<AgentState>({
        name: "coding-agent-network",
        agents: [CodeAgent],
        maxIter: 15,
        router: async ({ network }) => {
          const summary = network.state.data.summary;

          if (summary) {
            return;
          }

          return CodeAgent;
        },
      });

      const result = await network.run(event.data.value);

      const isError =
        !result.state.data.summary ||
        Object.keys(result.state.data.files || {}).length === 0;

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      });

      await step.run("save-result", async () => {
        if (isError) {
          return await prisma.message.create({
            data: {
              content:
                "Sorry, I encountered an error while generating the code. Please try again later.",
              role: "ASSISTANT",
              type: "ERROR",
              projectId: event.data.projectId,
            },
          });
        }

        await prisma.message.create({
          data: {
            content: result.state.data.summary,
            role: "ASSISTANT",
            type: "RESULT",
            projectId: event.data.projectId,
            fragment: {
              create: {
                title: "Fragment",
                files: result.state.data.files,
                sandboxUrl: sandboxUrl,
              },
            },
          },
        });
      });

      return {
        url: sandboxUrl,
        title: "Fragment",
        files: result.state.data.files,
        summary: result.state.data.summary,
      };
    } catch (error) {
      console.error("AI agent error:", error);
      return {
        output:
          "Sorry, I encountered an error while generating the code snippet. Please try again later.",
        error: true,
      };
    }
  }
);
