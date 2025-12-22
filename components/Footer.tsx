"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaCoffee } from "react-icons/fa";

// 1. Define translations locally
const translations = {
  en: {
    source: "Source code",
    support: "Support us",
    githubLabel: "View source code on GitHub",
    kofiLabel: "Support us on Ko-fi",
    builtWith: "Built for the neurodivergent community"
  },
  es: {
    source: "Código fuente",
    support: "Apóyanos",
    githubLabel: "Ver código fuente en GitHub",
    kofiLabel: "Apóyanos en Ko-fi",
    builtWith: "Creado para la comunidad neurodivergente"
  }
};

export function Footer({ lang = "es" }: { lang?: string }) {
  // 2. Select content based on the prop
  const content = translations[lang as keyof typeof translations] || translations.es;

  return (
    <footer className="bg-white border-t border-brandGrayLight pt-16 pb-12">
      <div className="container mx-auto px-6 flex flex-col items-center text-center">

        <div className="mb-8 relative group">
          <div className="absolute -inset-4 bg-brandBlue/5 rounded-full blur-xl group-hover:bg-brandBlue/10 transition-all opacity-0 group-hover:opacity-100 duration-500" />
          <Image
            src="/ardilla2.png"
            alt="OpenTEA mascot"
            width={80}
            height={80}
            priority
            className="relative opacity-90 grayscale-[20%] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {/* GitHub Button: Clean Minimalist */}
          <Link
            href="https://github.com/alinarojas/OpenTEA"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-gray-900 hover:border-gray-400 hover:shadow-xs transition-all text-sm font-medium"
            aria-label={content.githubLabel}
          >
            <FaGithub className="text-lg" />
            <span>{content.source}</span>
          </Link>

          <Link
            href="https://ko-fi.com/opentea"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-full text-rose-400 hover:bg-rose-100 hover:border-rose-200 hover:shadow-xs transition-all text-sm font-medium"
            aria-label={content.kofiLabel}
          >
            <FaCoffee className="text-lg" />
            <span>{content.support}</span>
          </Link>
        </div>

        {/* Separator */}
        <div className="w-12 h-px bg-brandGray mb-6"></div>

        {/* Copyright & Tagline */}
        <div className="space-y-2">
            <p className="text-xs font-medium text-brandGrayDark/60 uppercase tracking-wider">
            © {new Date().getFullYear()} OpenTEA
            </p>
            <p className="text-sm text-brandGrayDark/50 font-medium">
             {content.builtWith}
            </p>
        </div>

      </div>
    </footer>
  );
}