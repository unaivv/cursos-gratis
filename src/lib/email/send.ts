import { Resend } from "resend";

// Same pattern/provider as the other apps on the raspi (Resend). Optional
// by design: a missing RESEND_API_KEY disables email instead of crashing
// the request that triggered it — a suggestion still gets saved to the
// DB, a sync still runs, even if the notification email can't go out.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM_EMAIL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export { escapeHtml };

/** Fire-and-forget notification to the site admin. Never throws — a mail
 * failure must not fail the request that triggered it. */
export async function sendAdminNotification(subject: string, html: string): Promise<void> {
  if (!resend || !FROM || !ADMIN_EMAIL) {
    console.warn("[email] skipped — RESEND_API_KEY/RESEND_FROM_EMAIL/ADMIN_EMAIL not fully set");
    return;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to: [ADMIN_EMAIL], subject, html });
    if (error) console.error("[email] send failed:", error.message);
  } catch (err) {
    console.error("[email] send threw:", err);
  }
}
