import { gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    try {
      const supportAgent = createAgent({
        model: gemini({ model: "gemini-1.5-flash"}),
        name: "code-agent",
        system:
          "You are an expert Next.js developer. You write readable, maintainable code. Generate simple, well-commented Next.js and React code snippets based on user requests",
      });

      const { output } = await supportAgent.run(
        `Write the following snippet: ${event.data.value}`
      );

      return { output };
    } catch (error) {
      console.error('AI agent error:', error);
      return {
        output: 'Sorry, I encountered an error while generating the code snippet. Please try again later.',
        error: true,
      };
    }
  }
);
