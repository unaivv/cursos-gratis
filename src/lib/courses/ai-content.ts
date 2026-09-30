import { z } from "zod";
import { courseAnalysisSchema } from "./ai-analysis";

/**
 * Shape and limits of the AI-written course content. The generation
 * happens outside the app (see scripts/export-course-data.ts and
 * scripts/import-ai-content.ts); this schema is the gate that keeps
 * anything malformed or oversized out of the database.
 */
export const aiContentSchema = z.object({
  id: z.string().uuid(),
  summary: z.string().trim().min(20).max(200),
  overview: z.string().trim().min(20).max(1200),
  highlights: z.array(z.string().trim().min(2).max(80)).max(5),
  level: z.enum(["principiante", "intermedio", "avanzado"]).nullable(),
  // Optional so the older summary-only files still import; the rich
  // analysis is what makes a course page indexable (lib/courses/depth.ts).
  analysis: courseAnalysisSchema.optional(),
});

export type AiContent = z.infer<typeof aiContentSchema>;

export const AI_LEVEL_LABEL: Record<"principiante" | "intermedio" | "avanzado", string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};
