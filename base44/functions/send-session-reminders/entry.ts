import { createClientFromRequest } from "npm:@base44/sdk";

// Runs on a cron (every 30 minutes). Finds sessions scheduled ~24 hours from
// now that haven't been reminded yet, emails the student, and marks
// reminder_sent_at so each session is reminded at most once.
export default async function (req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);

  const now = new Date();
  const from = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23h from now
  const to = new Date(now.getTime() + 25 * 60 * 60 * 1000); // 25h from now

  const page = await base44.asServiceRole.entities.Session.filter(
    {
      status: "scheduled",
      scheduled_time: { $gte: from.toISOString(), $lte: to.toISOString() },
      reminder_sent_at: { $exists: false },
    },
    { limit: 100 }
  );
  const sessions = (page && (page as any).items) ? (page as any).items : (page as any[]);

  let sent = 0;
  const errors: { id: string; error: string }[] = [];

  for (const s of sessions) {
    try {
      const user = await base44.asServiceRole.entities.User.get(s.created_by_id);
      if (!user?.email) continue;

      const when = new Date(s.scheduled_time).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "long",
        timeStyle: "short",
      });

      const lines = [
        `Hi ${user.full_name || "there"},`,
        "",
        "This is a gentle reminder that you have a counseling session coming up in about 24 hours.",
        "",
        `Counselor: ${s.counselor_name || "your counselor"}`,
        `When: ${when} (IST)`,
        `Modality: ${s.modality === "video" ? "Video call" : "In person"}`,
      ];
      if (s.topic) lines.push(`Topic: ${s.topic}`);
      lines.push(
        "",
        "You can view or manage your session in the MindHaven app.",
        "",
        "Take care,",
        "The MindHaven Team"
      );

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: user.email,
        subject: "Reminder: your MindHaven counseling session is tomorrow",
        body: lines.join("\n"),
        from_name: "MindHaven",
      });

      await base44.asServiceRole.entities.Session.update(s.id, {
        reminder_sent_at: new Date().toISOString(),
      });
      sent++;
    } catch (e) {
      errors.push({ id: s.id, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return Response.json({ sent, checked: sessions.length, errors });
}