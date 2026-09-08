"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

// Spec: admin-auth — "Logout ends the session".
export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push("/admin/login"),
          },
        })
      }
      className="w-fit border border-rule px-4 py-2 font-sans text-sm text-ink-muted hover:text-ink"
    >
      Cerrar sesión
    </button>
  );
}
