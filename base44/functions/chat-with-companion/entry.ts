
import { createClientFromRequest } from "npm:@base44/sdk";

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;

const COMPANION_SYSTEM = `You are Sage, a warm, calm and empathetic mental health support companion for university students. Listen without judgment, validate feelings, and gently suggest practical coping strategies such as grounding, journaling, and planning rest. Keep replies concise, usually 2–5 sentences. Never diagnose or prescribe. Do not claim to be a licensed therapist or a human. If someone describes immediate danger or a mental health crisis, encourage them to contact local emergency services or a crisis support service and reach out to a trusted person. Encourage campus counseling when appropriate.`;

export default async function (req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const messages = body?.messages;

    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.length > MAX_MESSAGES ||
      !messages.every(
        (message: any) =>
          message &&
          ["user", "assistant"].includes(message.role) &&
          typeof message.content === "string" &&
          message.content.length <= MAX_CONTENT_LENGTH
      )
    ) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    const transcript = messages
      .map(
        (message: { role: "user" | "assistant"; content: string }) =>
          `${message.role === "user" ? "Student" : "Sage"}: ${message.content}`
      )
      .join("\n");

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `${COMPANION_SYSTEM}\n\nConversation so far:\n${transcript}\n\nSage:`,
      model: "automatic",
    });

    return Response.json({
      reply: typeof result === "string" ? result : String(result ?? ""),
    });
  } catch (error) {
    const status = (error as { status?: number })?.status;

    if (status === 401 || status === 403) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("Sage companion function failed:", error);
    return Response.json(
      { error: "Sage is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}
