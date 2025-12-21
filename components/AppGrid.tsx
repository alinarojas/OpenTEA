// components/AppGrid.tsx
import { AppCard } from "./AppCard";

// --- Translations ---
const gridTranslations = {
  en: {
    noMatch: "No apps match the selected filters",
    tryAdjusting: "Try adjusting your search or removing some filters",
  },
  es: {
    noMatch: "No hay apps que coincidan con los filtros seleccionados",
    tryAdjusting: "Prueba a ajustar tu búsqueda o eliminar algunos filtros",
  },
};

interface AppsGridProps {
  apps: any[];
  lang: "en" | "es"; // Changed from 'string' to specific union type for safety
}

export function AppsGrid({ apps, lang }: AppsGridProps) {
  // Fallback to English if lang is missing or invalid
  const t = gridTranslations[lang] || gridTranslations.en;

  if (!apps.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border-2 border-dashed border-brandGray/40 bg-brandGrayLight/40">
        <p className="text-brandGrayDark/70 font-medium">
           {t.noMatch}
        </p>
        <p className="text-sm text-brandGrayDark/50 mt-1">
           {t.tryAdjusting}
        </p>
      </div>
    );
  }

  return (
    // items-stretch ensures all cards in a row have equal height
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} lang={lang} />
      ))}
    </div>
  );
}