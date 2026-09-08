"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCourseStatus } from "../actions";
import { nextCourseStatus, type CourseStatus } from "@/lib/courses/status-transition";

// Spec: admin-panel — "Publish/unpublish toggles public visibility".
export function PublishToggleButton({ id, status }: { id: string; status: CourseStatus }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = nextCourseStatus(status);
  const label = status === "published" ? "despublicar" : "publicar";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setCourseStatus(id, next);
          router.refresh();
        })
      }
      className="font-mono text-xs text-ink-muted hover:text-ink disabled:opacity-50"
    >
      {label}
    </button>
  );
}
