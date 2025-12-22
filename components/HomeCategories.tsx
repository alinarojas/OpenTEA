"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AppCard } from "./AppCard";
import { CATEGORY_CONFIG } from "@/src/config/categories";

type Lang = "en" | "es";
type CategoryKey = "aac" | "routines" | "social";

interface CategoryRowProps {
  apps: any[];
  lang: Lang;
  category: CategoryKey;
}

function selectTopAppsByCategory(apps: any[], category: CategoryKey): any[] {
  const cfg = CATEGORY_CONFIG[category];

  const filtered = apps.filter((app) => {
    const tags: string[] = app.tags ?? [];
    return tags.some((tag) => {
      const lowerTag = tag.toLowerCase();
      return cfg.matchTags.some((keyword: string) => lowerTag.includes(keyword.toLowerCase()));
    });
  });

  filtered.sort((a, b) => {
    // 1. PRIMARY: Ease of Use (High to Low)
    const easeDiff = (b.ease_of_use || 0) - (a.ease_of_use || 0);
    if (easeDiff !== 0) return easeDiff;

    // 2. SECONDARY: Price (Free/Freemium comes first)
    const isFreeA = a.price_type === 'free' || a.price_type === 'freemium';
    const isFreeB = b.price_type === 'free' || b.price_type === 'freemium';

    if (isFreeA && !isFreeB) return -1;
    if (!isFreeA && isFreeB) return 1;

    // 3. FALLBACK: updated_at (newest first)
    const dateA = new Date(a.updated_at || 0).getTime();
    const dateB = new Date(b.updated_at || 0).getTime();
    
    return dateB - dateA;
  });

  return filtered.slice(0, 3);
}

function CategoryRow({ apps, lang, category }: CategoryRowProps) {
  const cfg = CATEGORY_CONFIG[category];

  const currentLang: Lang = (lang === "es" || lang === "en") ? lang : "en";

  const title = cfg.title[currentLang];
  const description = cfg.description[currentLang];
  const buttonLabel = cfg.button[currentLang];
  const Icon = cfg.Icon;
  
  // 2. Select the slug based on the current language
  const currentSlug = cfg.slug[currentLang]; 

  const topApps = useMemo(
    () => selectTopAppsByCategory(apps, category),
    [apps, category]
  );

  if (!topApps.length) return null;

  return (
    <section className={`${cfg.bgClass} border border-brandGrayLight/60 px-6 py-10 md:px-20 lg:px-30 lg:py-16`}>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">

        {/* Text column */}
        <div className="lg:w-1/3 space-y-5 flex flex-col justify-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm shrink-0">
              <Icon className={`${cfg.iconClass} text-xl`} />
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-brandGrayDark">
              {title}
            </h2>
          </div>

          <p className="text-base text-brandGrayDark/80 leading-relaxed">
            {description}
          </p>

          <div className="pt-2">
            <Link
              // 3. CHANGED: Use the variable currentSlug instead of cfg.slug
              href={`/apps?category=${encodeURIComponent(currentSlug)}`}
              className="inline-flex items-center justify-center rounded-full bg-brandBlue px-6 py-2.5 text-sm font-semibold text-white hover:bg-brandBlue/90 transition-all shadow-sm"
            >
              {buttonLabel}
            </Link>
          </div>
        </div>

        {/* Apps column */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {topApps.map((app) => (
            <AppCard key={app.id} app={app} lang={currentLang} />
          ))}
        </div>
      </div>
    </section>
  );
}

// EXPORTS
export function AacCategoryRow(props: { apps: any[]; lang: Lang }) {
  return <CategoryRow {...props} category="aac" />;
}

export function RoutinesCategoryRow(props: { apps: any[]; lang: Lang }) {
  return <CategoryRow {...props} category="routines" />;
}

export function SocialSkillsCategoryRow(props: { apps: any[]; lang: Lang }) {
  return <CategoryRow {...props} category="social" />;
}