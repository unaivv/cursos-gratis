import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Política de privacidad";
const DESCRIPTION = "Qué datos recoge cursos.unaividal.com y cómo se usan.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { title: TITLE, description: DESCRIPTION },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-3">
        <Link href="/" className="w-fit font-mono text-xs text-ink-muted hover:text-ink">
          ← inicio
        </Link>
        <h1 className="font-serif text-3xl text-ink">{TITLE}</h1>
        <p className="font-mono text-xs text-ink-muted">Última actualización: septiembre de 2026</p>
      </div>

      <div className="flex flex-col gap-8 text-ink-muted">
        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-ink">Qué es este sitio</h2>
          <p>
            cursos.unaividal.com es un catálogo de cursos gratuitos de YouTube y Udemy. No
            aloja ningún curso — cada ficha enlaza a la plataforma original. Es un proyecto
            personal de Unai Vidal (<a href="https://unaividal.com" className="underline underline-offset-2 hover:text-ink">unaividal.com</a>).
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-ink">Qué datos se recogen</h2>
          <ul className="flex flex-col gap-3">
            <li>
              <strong className="text-ink">Búsquedas.</strong> Cada búsqueda que encuentra
              algún resultado se guarda (solo el texto buscado y la fecha, sin identificarte)
              para mostrar las &ldquo;peticiones populares&rdquo; en la portada.
            </li>
            <li>
              <strong className="text-ink">Sugerencias de curso.</strong> Si usas el
              formulario de <Link href="/sugerir" className="underline underline-offset-2 hover:text-ink">sugerir un curso</Link>,
              guardamos la URL, tu nota y tu email si decides darlo (es opcional).
            </li>
            <li>
              <strong className="text-ink">Analítica</strong> (Google Tag Manager) —{" "}
              <em>solo si aceptas el aviso de cookies</em> que aparece al entrar. Mide qué
              fichas se usan. Puedes rechazarlo sin que el catálogo deje de funcionar; tu
              elección se guarda en tu navegador (localStorage), no en un servidor.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-ink">Publicidad</h2>
          <p>
            Este sitio puede mostrar anuncios servidos por Google AdSense. Es un consentimiento
            aparte del de analítica: si estás en el Espacio Económico Europeo, Reino Unido o
            Suiza, Google te mostrará su propio aviso (gestionado por su plataforma de
            consentimiento, no por el banner de cookies de este sitio) para decidir si los
            anuncios se personalizan según tu navegación. Puedes gestionar esas preferencias en{" "}
            <a
              href="https://adssettings.google.com"
              rel="noopener noreferrer"
              target="_blank"
              className="underline underline-offset-2 hover:text-ink"
            >
              adssettings.google.com
            </a>
            . Más información en la{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              rel="noopener noreferrer"
              target="_blank"
              className="underline underline-offset-2 hover:text-ink"
            >
              política de socios publicitarios de Google
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-ink">Lo que no hacemos</h2>
          <p>
            No vendemos tus datos. No pedimos cuenta ni contraseña para usar el catálogo. No
            compartimos tu email de sugerencia con nadie salvo, si aceptas cookies, con Google
            (analítica y, si corresponde, publicidad) en la forma descrita arriba.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-serif text-xl text-ink">Contacto</h2>
          <p>
            Para cualquier duda sobre tus datos, escribe a través del{" "}
            <Link href="/sugerir" className="underline underline-offset-2 hover:text-ink">formulario del sitio</Link>{" "}
            indicando tu petición, o contacta desde{" "}
            <a href="https://unaividal.com" className="underline underline-offset-2 hover:text-ink">unaividal.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
