import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

export const getServerInfo = createServerFn({ method: "GET" }).handler(async () => ({
  renderedAt: new Date().toISOString(),
}));

/* ---------- Counselors ---------- */
export const listCounselors = createServerFn({ method: "GET" }).handler(({ context }) =>
  context.getBase44().entities.Counselor.list("-created_date", 50));

export const getCounselor = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(({ data, context }) =>
    context.getBase44().entities.Counselor.get(data.id).catch((e) => {
      if (e?.status === 404) return null;
      throw e;
    }));

/* ---------- Sessions ---------- */
const SessionInput = z.object({
  counselor_id: z.string(),
  counselor_name: z.string().optional(),
  scheduled_time: z.string(),
  duration_minutes: z.number().int().optional(),
  modality: z.enum(["video", "in-person"]),
  topic: z.string().max(200).optional(),
});

export const createSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(SessionInput)
  .handler(({ data, context }) =>
    context.getBase44().entities.Session.create({ ...data, status: "scheduled" }));

export const listMySessions = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const page = await context
      .getBase44()
      .entities.Session.filter({ created_by_id: context.user.id }, { sort: "scheduled_time", limit: 100 });
    return page.items ?? page;
  });

export const cancelSession = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string() }))
  .handler(({ data, context }) =>
    context.getBase44().entities.Session.update(data.id, { status: "cancelled" }));

/* ---------- Mood ---------- */
const MoodInput = z.object({
  mood: z.enum(["great", "good", "okay", "low", "rough"]),
  emotions: z.array(z.string()).max(10).optional(),
  notes: z.string().max(1000).optional(),
});

export const createMoodEntry = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(MoodInput)
  .handler(({ data, context }) => context.getBase44().entities.MoodEntry.create(data));

export const listMoodEntries = createServerFn({ method: "GET" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const page = await context
      .getBase44()
      .entities.MoodEntry.filter({ created_by_id: context.user.id }, { sort: "-created_date", limit: 60 });
    return page.items ?? page;
  });

/* ---------- Resources ---------- */
export const listResources = createServerFn({ method: "GET" })
  .validator(z.object({ category: z.string().optional() }).optional())
  .handler(async ({ data, context }) => {
    const query = data?.category ? { category: data.category } : {};
    const page = await context.getBase44().entities.Resource.filter(query, { sort: "-created_date", limit: 100 });
    return page.items ?? page;
  });

/* ---------- AI Companion ---------- */
const ChatInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(2000) }))
    .max(20),
});

const COMPANION_SYSTEM = `You are Sage, a warm, calm and empathetic mental health support companion for university students. You listen without judgment, validate feelings, and gently suggest practical, evidence-informed coping strategies (breathing, grounding, journaling, reframing, scheduling rest). You are supportive and conversational, using clear and gentle language. Keep replies concise (2-5 sentences) unless the student needs more. Never diagnose or prescribe. If the student mentions self-harm, suicide, abuse, or being in immediate danger, gently urge them to contact local emergency services or a crisis line right away and reach out to someone they trust. Do not claim to be a licensed therapist or a human; you are a supportive companion. Always encourage connecting with the campus counseling service when something feels heavy.`;

export const chatWithCompanion = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(ChatInput)
  .handler(async ({ data, context }) => {
    const transcript = data.messages
      .map((m) => `${m.role === "user" ? "Student" : "Sage"}: ${m.content}`)
      .join("\n");
    const prompt = `${COMPANION_SYSTEM}\n\nConversation so far:\n${transcript}\n\nSage:`;
    const result = await context.getBase44().asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: "automatic",
    });
    return { reply: typeof result === "string" ? result : String(result ?? "") };
  });