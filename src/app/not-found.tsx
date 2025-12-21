"use client";

import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

const translations = {
  en: {
    title: "Page not found",
    description: "The squirrel couldn’t find this page. It may not exist or may have been moved",
    button: "Back to home",
  },
  es: {
    title: "Página no encontrada",
    description: "La ardilla no ha podido encontrar esta página. Puede que el enlace no exista o se haya movido",
    button: "Volver al inicio",
  },
};

export default function NotFoundPage() {
  const lang = (Cookies.get("lang") || "es") as "en" | "es";
  const content = translations[lang] || translations.es;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-brandGrayLight">
      
      <Image
        src="/ardilla.png"
        alt="OpenTEA Mascot"
        width={180}
        height={180}
        className="mb-6 opacity-90"
      />

      <h1 className="text-5xl font-bold text-brandGrayDark mb-4">
        {content.title}
      </h1>

      <p className="text-lg md:text-xl text-brandGrayDark/80 max-w-md mb-10">
        {content.description}
      </p>

      <Link
        href="/"
        className="text-lg font-semibold px-6 py-3 rounded-md bg-brandBlue text-white hover:opacity-90 transition"
      >
        {content.button}
      </Link>
    </section>
  );
}