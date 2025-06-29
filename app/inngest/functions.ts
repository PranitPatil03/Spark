import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("started", "5s");
    await step.sleep("doing-work", "15s");
    await step.sleep("final", "7s");
    return { message: `Hello ${event.data.email}!` };
  },
);
