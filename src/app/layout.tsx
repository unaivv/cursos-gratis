import type { Metadata } from "next";
import { Newsreader, Public_Sans, Courier_Prime } from "next/font/google";
import { ConsentGate } from "@/components/analytics/ConsentGate";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Newsreader: editorial serif for course titles — the catalog's "card" voice.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Public Sans: the US government's public-service typeface — fits a
// "public catalog" concept for UI chrome/navigation/body text.
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

// Courier Prime: only for catalog numbers and dates — a real data role,
// not a decorative label font.
const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const DEFAULT_TITLE = "cursos.unaividal.com — cursos gratis verificados de YouTube y Udemy";
const DEFAULT_DESCRIPTION =
  "Catálogo de cursos gratuitos de YouTube y Udemy, organizados por categoría.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${publicSans.variable} ${courierPrime.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper font-sans text-ink">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
        <ConsentGate />
      </body>
    </html>
  );
}
