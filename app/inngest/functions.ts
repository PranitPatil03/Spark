import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {
      const sandboxId = await step.run("get-sandbox-id", async () => {
        const sandbox = await Sandbox.create("spark-nextjs-dev");
        return sandbox.sandboxId;
      });

      const supportAgent = createAgent({
        model: gemini({ model: "gemini-1.5-flash" }),
        name: "code-agent",
        system:
          "You are an expert Next.js developer. You write readable, maintainable code. Generate simple, well-commented Next.js and React code snippets based on user requests",
      });

      const { output } = await supportAgent.run(
        `Write the following snippet: ${event.data.value}`
      );

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        const sandbox = await getSandbox(sandboxId);
        const host = sandbox.getHost(3000);
        return `https://${host}`;
      });

      return { output, sandboxUrl };
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
