import { gemini, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const supportAgent = createAgent({
      model: gemini({ model: "gemini-1.5-flash"}),
      name: "code-agent",
      system:
        "You are an expert next.js developer. You write readable,maintainable code. You write simple next.js and react snippets.",
    });

    const { output } = await supportAgent.run(
      `Write the follwing snippet :${event.data.value}`
    );

    return { output };
  }
);
