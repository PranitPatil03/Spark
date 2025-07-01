import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompts";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {
      const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("spark-nextjs-dev");
        return sandbox.sandboxId;
      });

      const CodeAgent = createAgent({
        model: gemini({ model: "gemini-1.5-flash-8b" }),
        // model:openai({model:"gpt-4.1"}),
        name: "code-agent",
        description: "An expert coding agent",
        system: PROMPT,
        tools: [
          createTool({
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
          }),
          createTool({
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
            handler: async ({ files }, { step, network }) => {
              return await step?.run("createOrUpdateFiles", async () => {
                const newFiles = await step?.run(
                  "createOrUpdateFiles",
                  async () => {
                    try {
                      console.log("here");
                      const updatedFiles = network.state.data.files || {};
                      const sandbox = await getSandbox(sandboxId);
                      for (const file of files) {
                        await sandbox.files.write(file.path, file.content);
                        updatedFiles[file.path] = file.content;
                      }
                      console.log("updatedFiles", updatedFiles);
                      return updatedFiles;
                    } catch (e) {
                      console.error("ERROR:" + e);
                      return `Error reading files: ${e}`;
                    }
                  }
                );

                console.log("newFiles", newFiles);

                if (typeof newFiles === "object") {
                  network.state.data.files = newFiles;
                }
              });
            },
          }),
          createTool({
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
          }),
        ],
        lifecycle: {
          onResponse: async ({ result, network }) => {
            const lastAssistantTextMessageText =
              lastAssistantTextMessageContent(result);

            if (lastAssistantTextMessageText && network) {
              if (lastAssistantTextMessageText.includes("<task_summary>")) {
                network.state.data.summary = lastAssistantTextMessageText;
              }
            }
            return result;
          },
        },
      });

      const network = createNetwork({
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

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      });

      return {
        url: sandboxUrl,
        title: "Fragment",
        files: result.state.data.files,
        summary: result.state.data.summary,
        data: result.state.data,
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
