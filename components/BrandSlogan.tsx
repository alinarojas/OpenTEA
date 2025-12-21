"use client";

// Translations 
const translations = {
  en: {
    text: "Clear, accessible, and trustworthy technology to support autistic people",
  },
  es: {
    text: "Tecnología clara, accesible y confiable para apoyar a personas autistas",
  },
};

export default function BrandSlogan({ lang = "es" }: { lang?: string }) {
  // Select content based on prop
  const content = translations[lang as keyof typeof translations] || translations.es;

  return (
    <div className="bg-brandGrayLight py-10 px-6 text-center">
      <p className="text-xl md:text-2xl font-medium text-brandGrayDark">
        {content.text}
      </p>
    </div>
  );
}