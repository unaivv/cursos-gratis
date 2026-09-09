import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { listAllCourses } from "@/lib/db/admin-queries";
import { readCategories } from "@/lib/courses/read";
import { LogoutButton } from "./logout-button";
import { CourseListWithBulkActions } from "./courses/CourseListWithBulkActions";

type SearchParams = { status?: string; platform?: string; category?: string };

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status === "pending" || params.status === "published" ? params.status : undefined;
  const platform = params.platform === "youtube" || params.platform === "udemy" ? params.platform : undefined;
  const category = params.category || undefined;

  const [session, courses, categories] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    listAllCourses({ status, platform, category }),
    readCategories(),
  ]);

  const hasFilters = Boolean(status || platform || category);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          Sesión: <strong className="text-ink">{session?.user.email}</strong>
        </p>
        <LogoutButton />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Cursos ({courses.length})</h1>
        <Link
          href="/admin/courses/new"
          className="border-2 border-dashed border-stamp-red px-4 py-2 font-sans text-sm font-medium text-stamp-red hover:bg-stamp-red hover:text-paper"
        >
          + Nuevo curso
        </Link>
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-4 border border-rule bg-card p-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-xs text-ink-muted">
            Estado
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="border border-rule bg-paper px-2 py-1.5 text-sm text-ink"
          >
            <option value="">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="published">Publicados</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="platform" className="text-xs text-ink-muted">
            Plataforma
          </label>
          <select
            id="platform"
            name="platform"
            defaultValue={platform ?? ""}
            className="border border-rule bg-paper px-2 py-1.5 text-sm text-ink"
          >
            <option value="">Todas</option>
            <option value="youtube">YouTube</option>
            <option value="udemy">Udemy</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-xs text-ink-muted">
            Categoría
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category ?? ""}
            className="border border-rule bg-paper px-2 py-1.5 text-sm text-ink"
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="border border-ink px-4 py-1.5 text-sm text-ink hover:bg-ink hover:text-paper"
        >
          Filtrar
        </button>

        {hasFilters && (
          <Link href="/admin" className="font-mono text-xs text-ink-muted underline hover:text-ink">
            quitar filtros
          </Link>
        )}
      </form>

      <CourseListWithBulkActions courses={courses} />
    </div>
  );
}
