import Sandbox from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  return sandbox;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) =>
      message.role === "assistant" ||
      (message as { role?: string }).role === "model"
  );

  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

    console.log("message",message)

  if (!message?.content) return undefined;

  // OpenAI: string
  if (typeof message.content === "string") {
    return message.content;
  }

  // OpenAI: array of { text }
  if (Array.isArray(message.content)) {
    return message.content.map((c) => c.text).join("");
  }

  // Gemini: { parts: [{ text }] }
  if (
    typeof message.content === "object" &&
    Array.isArray((message.content as { parts?: { text: string }[] }).parts)
  ) {
    const parts = (message.content as { parts: { text: string }[] }).parts;
    return parts.map((p) => p.text).join("");
  }

  return undefined;
}
