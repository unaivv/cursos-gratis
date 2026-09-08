"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const { error: signInError } = await authClient.signIn.email({ email, password });
    setPending(false);

    if (signInError) {
      setError("Credenciales incorrectas.");
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="font-serif text-2xl text-ink">Acceso admin</h1>
      <form action={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className="border border-rule bg-card px-3 py-2 text-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Contraseña
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="border border-rule bg-card px-3 py-2 text-ink"
          />
        </label>
        {error && <p className="text-sm text-stamp-red">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="border-2 border-dashed border-stamp-red px-4 py-2 font-sans font-medium text-stamp-red hover:bg-stamp-red hover:text-paper disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
