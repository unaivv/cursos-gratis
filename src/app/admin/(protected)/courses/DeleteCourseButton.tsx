"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCourse } from "../actions";

// Spec: admin-panel — "Delete requires confirmation".
export function DeleteCourseButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Borrar "${title}" definitivamente?`)) {
          startTransition(async () => {
            await deleteCourse(id);
            router.refresh();
          });
        }
      }}
      className="font-mono text-xs text-stamp-red hover:underline disabled:opacity-50"
    >
      borrar
    </button>
  );
}
