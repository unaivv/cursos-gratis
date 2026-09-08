"use client";

import { useActionState, useState } from "react";
import type { Category } from "@/lib/courses/schema";
import type { CourseFormState } from "../actions";

type FormAction = (state: CourseFormState, formData: FormData) => Promise<CourseFormState>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CourseForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: FormAction;
  categories: Category[];
  defaultValues?: {
    slug: string;
    title: string;
    author?: string;
    platform: "youtube" | "udemy";
    category: string;
    sourceUrl: string;
    status: "pending" | "published";
    lastVerifiedAt: string;
    youtubeVideoId?: string;
    youtubePlaylistId?: string;
    youtubeChannelId?: string;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<CourseFormState, FormData>(action, {});
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const [platform, setPlatform] = useState<"youtube" | "udemy">(defaultValues?.platform ?? "udemy");

  const errors = state.errors ?? {};
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Título
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          onChange={(e) => {
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          className="border border-rule bg-card px-3 py-2 text-ink"
        />
        {errors.title && <span className="text-stamp-red">{errors.title}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Slug
        <input
          type="text"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          className="border border-rule bg-card px-3 py-2 font-mono text-ink"
        />
        {errors.slug && <span className="text-stamp-red">{errors.slug}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Autor / instructor
        <input
          type="text"
          name="author"
          defaultValue={defaultValues?.author}
          placeholder="ej. Tim Ruscica"
          className="border border-rule bg-card px-3 py-2 text-ink"
        />
        {errors.author && <span className="text-stamp-red">{errors.author}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Plataforma
        <select
          name="platform"
          required
          value={platform}
          onChange={(e) => setPlatform(e.target.value as "youtube" | "udemy")}
          className="border border-rule bg-card px-3 py-2 text-ink"
        >
          <option value="udemy">Udemy</option>
          <option value="youtube">YouTube</option>
        </select>
        {errors.platform && <span className="text-stamp-red">{errors.platform}</span>}
      </label>

      {platform === "youtube" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-ink-muted">
            Rellena videoId (un vídeo) o playlistId (un curso hecho de varios
            vídeos) — al menos uno de los dos.
          </p>
          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
              YouTube videoId
              <input
                type="text"
                name="youtubeVideoId"
                defaultValue={defaultValues?.youtubeVideoId}
                className="border border-rule bg-card px-3 py-2 font-mono text-ink"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm text-ink-muted">
              YouTube playlistId
              <input
                type="text"
                name="youtubePlaylistId"
                defaultValue={defaultValues?.youtubePlaylistId}
                className="border border-rule bg-card px-3 py-2 font-mono text-ink"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm text-ink-muted">
            YouTube channelId
            <input
              type="text"
              name="youtubeChannelId"
              defaultValue={defaultValues?.youtubeChannelId}
              className="border border-rule bg-card px-3 py-2 font-mono text-ink"
            />
          </label>
        </div>
      )}
      {errors.youtube && <span className="text-sm text-stamp-red">{errors.youtube}</span>}

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Categoría
        <select
          name="category"
          required
          defaultValue={defaultValues?.category}
          className="border border-rule bg-card px-3 py-2 text-ink"
        >
          <option value="" disabled>
            — selecciona —
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && <span className="text-stamp-red">{errors.category}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        URL del curso
        <input
          type="url"
          name="sourceUrl"
          required
          defaultValue={defaultValues?.sourceUrl}
          className="border border-rule bg-card px-3 py-2 text-ink"
        />
        {errors.sourceUrl && <span className="text-stamp-red">{errors.sourceUrl}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Última verificación (gratis)
        <input
          type="date"
          name="lastVerifiedAt"
          required
          defaultValue={defaultValues?.lastVerifiedAt ?? today}
          className="border border-rule bg-card px-3 py-2 text-ink"
        />
        {errors.lastVerifiedAt && <span className="text-stamp-red">{errors.lastVerifiedAt}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-muted">
        Estado
        <select
          name="status"
          defaultValue={defaultValues?.status ?? "published"}
          className="border border-rule bg-card px-3 py-2 text-ink"
        >
          <option value="published">Publicado</option>
          <option value="pending">Pendiente</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-fit border-2 border-dashed border-stamp-red px-4 py-2 font-sans font-medium text-stamp-red hover:bg-stamp-red hover:text-paper disabled:opacity-50"
      >
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
