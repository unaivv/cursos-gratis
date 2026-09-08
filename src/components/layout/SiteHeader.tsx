import Link from "next/link";

const GITHUB_URL = "https://github.com/unaivv/cursos-gratis";

// lucide-react dropped brand marks — a small inline SVG instead of a
// dependency for one icon.
function GithubMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-card">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-baseline gap-3">
          {/* Bold, not italic — the design system's logo treatment
              (headline-md, font-bold, tracking-tight). Italic stays for
              card titles ("title-card"), not the wordmark. */}
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-ink shrink-0">
            cursos<span className="text-stamp-red">.</span>
          </Link>
          <span className="hidden font-mono text-[11px] text-ink-muted sm:inline">
            un proyecto de unaividal.com
          </span>
        </div>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="text-ink hover:underline underline-offset-4">
            Catálogo
          </Link>
          <Link
            href="/como-verificamos"
            className="hidden text-ink-muted hover:text-ink hover:underline underline-offset-4 sm:inline"
          >
            Cómo verificamos
          </Link>
          <a
            href="https://unaividal.com"
            rel="noopener noreferrer"
            target="_blank"
            className="hidden text-ink-muted hover:text-ink hover:underline underline-offset-4 md:inline"
          >
            unaividal.com
          </a>
          <a
            href={GITHUB_URL}
            rel="noopener noreferrer"
            target="_blank"
            aria-label="Código fuente en GitHub"
            className="text-ink-muted hover:text-ink"
          >
            <GithubMark />
          </a>
          <Link
            href="/sugerir"
            className="border border-ink px-3 py-1.5 text-ink hover:bg-ink hover:text-paper"
          >
            Sugerir curso
          </Link>
        </nav>

        <form action="/buscar" method="get" className="flex w-full sm:w-auto">
          <input
            type="search"
            name="q"
            placeholder="buscar cursos…"
            aria-label="Buscar cursos"
            className="w-full border border-rule bg-paper px-3 py-1.5 font-mono text-sm text-ink placeholder:text-ink-muted sm:w-48"
          />
        </form>
      </div>
    </header>
  );
}
