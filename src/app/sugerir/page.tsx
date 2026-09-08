import type { Metadata } from "next";
import Link from "next/link";
import { SuggestForm } from "./SuggestForm";

const TITLE = "Sugerir un curso";
const DESCRIPTION = "Propón un curso gratis de YouTube o Udemy para el catálogo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function SuggestPage() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink">{TITLE}</h1>
        <p className="text-ink-muted">
          ¿Conoces un curso gratis de verdad que debería estar aquí? Pásanos el enlace —
          lo comprobamos a mano antes de publicarlo, como con el resto del catálogo.
        </p>
      </div>

      <SuggestForm />
    </main>
  );
}
