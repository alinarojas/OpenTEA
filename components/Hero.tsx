"use client";

import Image from "next/image";
import Link from "next/link";
import { highlightEmphasis } from "@/src/utils/formatEmphasis";

// Translations
const text = {
  en: {
    heroBadge: "Independent autism-friendly app guide",
    title: "Your starting point for finding helpful __autism-focused__ *technology*",
    subtitle: "We collect and evaluate reliable apps so you can choose with confidence",
    ctaPrimary: "Browse apps",
    ctaSecondary: "How we review apps",
  },
  es: {
    heroBadge: "Guía independiente de apps para autismo",
    title: "Tu punto de partida para encontrar *tecnología útil* en __autismo__",
    subtitle: "Recopilamos y evaluamos apps confiables para que puedas elegir con tranquilidad",
    ctaPrimary: "Explorar apps",
    ctaSecondary: "Cómo evaluamos las apps",
  },
};

export default function Hero({ lang = "es" }: { lang?: string }) {
  // Select the correct language object based on the prop
  const content = text[lang as keyof typeof text] || text.es;
  const title = highlightEmphasis(content.title);

  return (
    <section className="bg-gradient-to-r from-[#F7FAFF] via-[#FDFCFB] to-[#F3FBF6]">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-20 grid gap-12 lg:grid-cols-2 items-center">
        {/* TEXT COLUMN */}
        <div className="space-y-6">
          <div className="flex justify-center lg:justify-start mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-base font-medium text-brandGrayDark shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brandGreen" />
              <span>{content.heroBadge}</span>
            </div>
          </div>

          <div className="space-y-6 text-center lg:text-left">
            <h1
              className="text-4xl md:text-5xl font-bold text-brandGrayDark leading-tight max-w-xl mx-auto lg:mx-0"
              dangerouslySetInnerHTML={{ __html: title }}
            />

            <p className="text-lg md:text-xl text-brandGrayDark/80 max-w-md mx-auto lg:mx-0">
              {content.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/apps"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-brandBlue px-6 py-3 text-sm font-semibold text-white hover:bg-brandBlue/90 transition shadow-sm"
              >
                {content.ctaPrimary}
              </Link>

              <Link
                href="/about"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-brandGrayLight bg-white/80 px-6 py-3 text-sm font-medium text-brandGrayDark hover:bg-brandGray/30 transition shadow-sm"
              >
                {content.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>

        {/* IMAGE COLUMN */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[#C7A27A]/5 blur-2xl" aria-hidden="true" />
            <div className="relative p-4">
              <Image
                src="/ardilla2.png"
                alt="OpenTEA mascot"
                width={500}
                height={500}
                priority
                className="w-80 lg:w-[25rem] drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}