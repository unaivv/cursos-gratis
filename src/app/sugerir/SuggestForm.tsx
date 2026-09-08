"use client";

import { useActionState } from "react";
import { submitSuggestion, type SuggestionFormState } from "./actions";

const initialState: SuggestionFormState = { status: "idle" };

export function SuggestForm() {
  const [state, formAction, pending] = useActionState(submitSuggestion, initialState);

  if (state.status === "success") {
    return (
      <div className="border border-rule bg-card p-6 text-ink">
        Gracias — la sugerencia está guardada y la revisamos a mano antes de publicarla,
        igual que el resto del catálogo.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="courseUrl" className="text-sm text-ink">
          URL del curso
        </label>
        <input
          id="courseUrl"
          name="courseUrl"
          type="url"
          required
          placeholder="https://www.youtube.com/... o https://www.udemy.com/course/..."
          className="border border-rule bg-card px-4 py-2.5 text-ink placeholder:text-ink-muted"
        />
        {state.errors?.courseUrl && <p className="text-sm text-stamp-red">{state.errors.courseUrl}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm text-ink">
          Nota (opcional)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Algo que debamos saber — por qué crees que encaja, si ya comprobaste que es gratis..."
          className="border border-rule bg-card px-4 py-2.5 text-ink placeholder:text-ink-muted"
        />
        {state.errors?.note && <p className="text-sm text-stamp-red">{state.errors.note}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="submitterEmail" className="text-sm text-ink">
          Tu email (opcional, por si hace falta preguntar algo)
        </label>
        <input
          id="submitterEmail"
          name="submitterEmail"
          type="email"
          placeholder="tú@ejemplo.com"
          className="border border-rule bg-card px-4 py-2.5 text-ink placeholder:text-ink-muted"
        />
        {state.errors?.submitterEmail && (
          <p className="text-sm text-stamp-red">{state.errors.submitterEmail}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-fit border-2 border-dashed border-stamp-red px-6 py-3 font-medium text-stamp-red hover:bg-stamp-red hover:text-paper disabled:opacity-50"
      >
        {pending ? "Enviando…" : "Enviar sugerencia"}
      </button>
    </form>
  );
}
