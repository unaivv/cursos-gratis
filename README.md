# cursos-unaividal

Catálogo de cursos **gratuitos** de YouTube y Udemy, organizados por
categoría, con verificación manual y fecha de última comprobación por
ficha. En vivo en [cursos.unaividal.com](https://cursos.unaividal.com).

Ver la definición completa de los cambios (propuesta, specs, diseño,
tareas) en `openspec/changes/course-catalog-mvp/` (catálogo inicial) y
`openspec/changes/admin-panel/` (base de datos + panel de admin).

## Desarrollo

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción (páginas del catálogo son dinámicas — leen Postgres en cada petición)
npm run start   # sirve el build de producción
npm run lint    # ESLint
npm run test    # Vitest (unit + integration)
```

## Base de datos

Supabase Postgres + Drizzle ORM (`src/lib/db/`). El catálogo era
originalmente JSON en git; se migró a base de datos para poder gestionarlo
desde el panel de admin sin esperar a un deploy — ver
`openspec/changes/admin-panel/design.md`.

Configuración:

1. Copia `.env.local.example` a `.env.local`.
2. `DATABASE_URL` — cadena de conexión de Supabase. Para scripts puntuales
   (migraciones, siembra) vale la conexión directa (puerto 5432); si algún
   día se despliega en Vercel, el runtime de la app necesita la del
   **pooler** ("Transaction", puerto 6543) — ver design.md. No la pegues
   nunca en el chat ni la commitees.
3. `BETTER_AUTH_SECRET` — genera uno con `openssl rand -base64 32`.
4. `npm run db:generate` — genera migraciones SQL a partir de
   `src/lib/db/schema.ts` + `src/lib/db/auth-schema.ts` (no necesita
   conexión real).
5. `npm run db:migrate` — aplica las migraciones (necesita `DATABASE_URL`
   real).
6. `npm run db:seed` — siembra categorías (`scripts/seed-categories.ts`).
7. `ADMIN_EMAIL`/`ADMIN_PASSWORD` (elígelos tú, no los pegues en el chat) +
   `npx tsx scripts/seed-admin.ts` — crea el único usuario admin. No hay
   registro público; este script es la única forma de crear una cuenta.

## Contenido: cómo se añaden cursos

Los cursos viven en la tabla `courses` (Supabase), no en ficheros.
Cada curso tiene `status`: `pending` (esperando revisión) o `published`
(visible en el sitio público). Gestión completa desde
**`/admin`** (login: `ADMIN_EMAIL`/`ADMIN_PASSWORD` sembrados con
`npx tsx scripts/seed-admin.ts`).

### YouTube (automático)

`scripts/sync-youtube.ts` sincroniza los canales/playlists curados en
`content/sources/youtube-channels.json` (nunca `search.list` — cuota
limitada a ~100 llamadas/día) y **inserta cada curso nuevo como
`pending`** — no aparece en el sitio público hasta que se publica desde
`/admin`. Se ejecuta:

- Localmente: `YOUTUBE_API_KEY=... DATABASE_URL=... npm run sync:youtube`
- En CI: `.github/workflows/sync-youtube.yml`, semanal (necesita los
  secrets `YOUTUBE_API_KEY` y `DATABASE_URL` en el repo).

Para añadir un canal nuevo, añade una entrada a
`content/sources/youtube-channels.json`.

### Udemy (curación manual — sin API)

La API de afiliados de Udemy está descontinuada desde el 1/1/2025 (ver
`openspec/changes/course-catalog-mvp/research.md`), así que los cursos de
Udemy se añaden a mano desde `/admin`:

1. Confirma manualmente que el curso es gratis (sin cupón, sin caducidad).
2. Créalo en el panel — puede publicarse directamente (el admin es quien
   revisa al crearlo).
3. Re-verifica cada `content.udemy_reverify_days` días
   (`openspec/config.yaml` — por defecto 30) que el curso siga siendo
   gratis, y actualiza `lastVerifiedAt` desde el panel.

## Analítica

Google Tag Manager, cargado solo tras consentimiento (banner de cookies) —
ver `src/components/analytics/`. Configura `NEXT_PUBLIC_GTM_ID` en el
entorno de producción para activarlo (GA4 u otras etiquetas se configuran
dentro del propio contenedor de GTM, no en este código); sin esa
variable, el sitio funciona igual pero sin analítica.

## Sugerencias de curso

`/sugerir` — formulario público que guarda en la tabla `course_suggestions`
(Supabase) y, si `RESEND_API_KEY`/`RESEND_FROM_EMAIL` están configurados,
avisa por email a `ADMIN_EMAIL`. Una sugerencia nunca se publica sola —
mismo criterio de revisión manual que el resto del catálogo.

## Peticiones populares

Los chips "peticiones populares" de la home son dinámicos: cada búsqueda
en `/buscar` que encuentra al menos un resultado se registra en
`search_queries`; la home muestra las más frecuentes de los últimos 30
días (`src/lib/courses/popular-searches.ts`). Sin histórico suficiente,
cae en una lista fija razonable.

## Despliegue

Corre en una Raspberry Pi propia, detrás de un túnel de Cloudflare
(`cursos.unaividal.com`), como el resto de proyectos personales del
autor — PM2 + build `standalone` de Next.js. Ver `deploy.sh`,
`ecosystem.config.cjs`, `start-prod.mjs`/`.sh`.

## Descubrimiento automático de contenido

Cron semanal en la misma Raspberry Pi que sincroniza los canales de
YouTube curados y guarda lo nuevo como `pending` (revisión manual antes
de publicar) — con resumen por email de lo encontrado. Ver
`scripts/README.md`.
