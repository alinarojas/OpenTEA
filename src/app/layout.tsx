import "./globals.css";

import { cookies } from "next/headers";
import type { Metadata } from "next";

import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/next"

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type Lang = "en" | "es";

function resolveLang(value?: string): Lang {
  return value === "en" || value === "es" ? value : "es";
}

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang: Lang = resolveLang(cookieStore.get("lang")?.value);

  const icons = {
    icon: "/logo.png",
  };

  if (lang === "en") {
    return {
      title: "OpenTEA",
      description: "Accessible technology for autism. A directory of apps evaluated by ease of use, sensory impact and cognitive load.",
      keywords: [
        "Autism",
        "ASD",
        "Autism Spectrum Disorder",
        "Apps for Autism",
        "Accessible Technology",
        "Neurodivergent Tools",
        "Special Education",
        "Sensory Friendly",
        "Cognitive Load",
        "Ease of Use"
      ],
      icons: icons,
    };
  }

  // Spanish (Default)
  return {
    title: "OpenTEA",
    description: "Tecnología accesible para autismo. Un directorio de apps evaluadas por facilidad de uso, impacto sensorial y carga cognitiva.",
    keywords: [
      "Autismo",
      "TEA",
      "Trastorno del Espectro Autista",
      "Apps para autismo",
      "Tecnología accesible",
      "Herramientas neurodivergentes",
      "Educación especial",
      "Impacto sensorial",
      "Carga cognitiva",
      "Facilidad de uso"
    ],
    icons: icons,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang: Lang = resolveLang(cookieStore.get("lang")?.value);

  return (
    <html lang={lang}>
      <body>
        <Navbar lang={lang} />
        {children}
        <Footer lang={lang} />

        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <Analytics />
      </body>
    </html>
  );
}

