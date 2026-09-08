import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";

/**
 * Authoritative session gate for every protected /admin/** route.
 * Spec: admin-auth — "Admin routes require a valid session".
 * Design: openspec/changes/admin-panel/design.md — Decision: Route
 * protection layer (layout-level check, not proxy.ts — see rationale
 * there).
 *
 * Lives in the `(protected)` route group specifically so `/admin/login`
 * — a sibling of this group, same URL prefix, different layout — never
 * passes through this gate. Gating it too would redirect the login page
 * to itself in an infinite loop.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-full flex-1">
      <header className="border-b border-rule px-6 py-4">
        <span className="font-mono text-xs text-ink-muted">panel de administración</span>
      </header>
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
