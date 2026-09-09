"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CourseRow } from "@/lib/db/schema";
import { isStaleUdemy } from "@/lib/courses/staleness";
import { bulkDeleteCourses, bulkSetCourseStatus } from "../actions";
import { PublishToggleButton } from "./PublishToggleButton";
import { DeleteCourseButton } from "./DeleteCourseButton";

/**
 * The admin course list plus a selection checkbox per row and a bulk
 * actions bar — publish/unpublish/delete N rows in one request instead
 * of one click per row. Selection is local UI state (a Set of ids); each
 * bulk action reuses the existing single-item server actions' bulk
 * counterparts and refreshes the list on completion, same pattern as
 * PublishToggleButton/DeleteCourseButton.
 */
export function CourseListWithBulkActions({ courses }: { courses: CourseRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = courses.length > 0 && selected.size === courses.length;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(courses.map((c) => c.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function runBulk(action: (ids: string[]) => Promise<void>) {
    const ids = [...selected];
    startTransition(async () => {
      await action(ids);
      setSelected(new Set());
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4 border border-rule bg-card px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={courses.length === 0} />
          {selected.size > 0
            ? `${selected.size} seleccionado${selected.size === 1 ? "" : "s"}`
            : "seleccionar todo"}
        </label>

        <div className="ml-auto flex flex-wrap gap-4">
          <button
            type="button"
            disabled={selected.size === 0 || pending}
            onClick={() => runBulk((ids) => bulkSetCourseStatus(ids, "published"))}
            className="font-mono text-xs text-stamp-gold hover:underline disabled:opacity-40 disabled:hover:no-underline"
          >
            publicar seleccionados
          </button>
          <button
            type="button"
            disabled={selected.size === 0 || pending}
            onClick={() => runBulk((ids) => bulkSetCourseStatus(ids, "pending"))}
            className="font-mono text-xs text-ink-muted hover:text-ink disabled:opacity-40"
          >
            despublicar seleccionados
          </button>
          <button
            type="button"
            disabled={selected.size === 0 || pending}
            onClick={() => {
              if (window.confirm(`¿Borrar ${selected.size} curso(s) definitivamente?`)) {
                runBulk((ids) => bulkDeleteCourses(ids));
              }
            }}
            className="font-mono text-xs text-stamp-red hover:underline disabled:opacity-40 disabled:hover:no-underline"
          >
            eliminar seleccionados
          </button>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-rule border border-rule">
        {courses.length === 0 && (
          <p className="p-4 text-ink-muted">Ningún curso coincide con estos filtros.</p>
        )}
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-wrap items-center justify-between gap-3 bg-card p-4"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selected.has(course.id)}
                onChange={() => toggleOne(course.id)}
                className="mt-1.5"
                aria-label={`Seleccionar ${course.title}`}
              />
              <div className="flex flex-col gap-1">
                <span className="font-serif text-ink">{course.title}</span>
                <span className="flex flex-wrap gap-2 font-mono text-xs text-ink-muted">
                  <span>{course.slug}</span>
                  <span>· {course.platform}</span>
                  <span>· {course.category}</span>
                  {course.author && <span>· {course.author}</span>}
                  <span
                    className={course.status === "published" ? "text-stamp-gold" : "text-ink-muted"}
                  >
                    · {course.status === "published" ? "publicado" : "pendiente"}
                  </span>
                  {isStaleUdemy(course) && (
                    <span className="text-stamp-red">
                      · sin re-verificar desde {course.lastVerifiedAt}
                    </span>
                  )}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-3">
              <PublishToggleButton id={course.id} status={course.status} />
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="font-mono text-xs text-ink-muted hover:text-ink"
              >
                editar
              </Link>
              <DeleteCourseButton id={course.id} title={course.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
