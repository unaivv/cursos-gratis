"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { courseSuggestions } from "@/lib/db/schema";
import { escapeHtml, sendAdminNotification } from "@/lib/email/send";

const suggestionSchema = z.object({
  courseUrl: z.string().trim().url("Pega una URL válida (ej. https://...)"),
  note: z.string().trim().max(500).optional(),
  submitterEmail: z.union([z.string().trim().email(), z.literal("")]).optional(),
});

export type SuggestionFormState = {
  status: "idle" | "success" | "error";
  errors?: Record<string, string>;
};

/** Public /sugerir form — inserts a pending suggestion for manual review,
 * same trust model as the rest of the catalog (see /como-verificamos).
 * Never auto-publishes a course. */
export async function submitSuggestion(
  _prevState: SuggestionFormState,
  formData: FormData
): Promise<SuggestionFormState> {
  const parsed = suggestionSchema.safeParse({
    courseUrl: formData.get("courseUrl"),
    note: formData.get("note"),
    submitterEmail: formData.get("submitterEmail"),
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string") errors[key] = issue.message;
    }
    return { status: "error", errors };
  }

  const { courseUrl, note, submitterEmail } = parsed.data;

  try {
    await db.insert(courseSuggestions).values({
      courseUrl,
      note: note || null,
      submitterEmail: submitterEmail || null,
    });
  } catch (err) {
    console.error("[sugerir] insert failed:", err);
    return { status: "error", errors: { courseUrl: "No se pudo guardar la sugerencia — inténtalo de nuevo." } };
  }

  await sendAdminNotification(
    "Nueva sugerencia de curso — cursos.unaividal.com",
    `
      <p>Alguien sugirió un curso desde el formulario público.</p>
      <p><strong>URL:</strong> <a href="${escapeHtml(courseUrl)}">${escapeHtml(courseUrl)}</a></p>
      ${note ? `<p><strong>Nota:</strong> ${escapeHtml(note)}</p>` : ""}
      ${submitterEmail ? `<p><strong>Email de contacto:</strong> ${escapeHtml(submitterEmail)}</p>` : ""}
    `
  );

  return { status: "success" };
}
