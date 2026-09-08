import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { listAllCourses } from "@/lib/db/admin-queries";
import { isStaleUdemy } from "@/lib/courses/staleness";
import { LogoutButton } from "./logout-button";
import { PublishToggleButton } from "./courses/PublishToggleButton";
import { DeleteCourseButton } from "./courses/DeleteCourseButton";

export default async function AdminHome() {
  const [session, allCourses] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    listAllCourses(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          Sesión: <strong className="text-ink">{session?.user.email}</strong>
        </p>
        <LogoutButton />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Cursos ({allCourses.length})</h1>
        <Link
          href="/admin/courses/new"
          className="border-2 border-dashed border-stamp-red px-4 py-2 font-sans text-sm font-medium text-stamp-red hover:bg-stamp-red hover:text-paper"
        >
          + Nuevo curso
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-rule border border-rule">
        {allCourses.length === 0 && (
          <p className="p-4 text-ink-muted">Todavía no hay cursos.</p>
        )}
        {allCourses.map((course) => (
          <div
            key={course.id}
            className="flex flex-wrap items-center justify-between gap-3 bg-card p-4"
          >
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
