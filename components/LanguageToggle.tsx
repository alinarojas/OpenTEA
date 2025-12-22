"use client";

import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { usePathname, useSearchParams } from "next/navigation";
import { CATEGORY_CONFIG } from "@/src/config/categories"; 

const FlagES = () => (
  <svg viewBox="0 0 640 480" className="w-5 h-5 rounded-sm">
    <path fill="#AA151B" d="M0 0h640v480H0z" />
    <path fill="#F1BF00" d="M0 160h640v160H0z" />
  </svg>
);

const FlagEN = () => (
  <svg viewBox="0 0 60 30" className="w-5 h-5 rounded-sm">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 h-60 v-15 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 60,30 M60,0 0,30"
        clipPath="url(#t)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const LANGUAGES = [
  { code: "es", label: "ES", flag: <FlagES /> },
  { code: "en", label: "EN", flag: <FlagEN /> },
];

// --- HELPER TO TRANSLATE SLUGS ---
function getTranslatedSlug(currentSlug: string, targetLang: string) {
  // Find which category the current slug belongs to (either English or Spanish)
  const entry = Object.values(CATEGORY_CONFIG).find((cat: any) => 
    cat.slug.en === currentSlug || cat.slug.es === currentSlug
  );

  // If the category is found, return the slug for the target language
  if (entry) {
    return entry.slug[targetLang as 'en' | 'es'];
  }

  // If it's not a translatable category (e.g., a search term), return it as is
  return currentSlug;
}

export default function LanguageToggle() {
  const [lang, setLang] = useState<string>("es");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Navigation hooks to read the current URL
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* Load cookie language */
  useEffect(() => {
    const saved = Cookies.get("lang") || "es";
    setLang(saved);
  }, []);

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang)!;
  const other = LANGUAGES.filter((l) => l.code !== lang);

  const select = (newLang: string) => {
    // 1. Save language preference
    Cookies.set("lang", newLang, { path: "/" });

    // 2. Calculate the new URL with translated parameters
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentCategory = currentParams.get('category');

    if (currentCategory) {
      // Translate "horarios-visuales" -> "visual-schedules" (or vice versa)
      const translatedSlug = getTranslatedSlug(currentCategory, newLang);
      currentParams.set('category', translatedSlug);
    }

    // 3. Force navigation to the new URL
    // We use window.location.href instead of router.push to ensure 
    // the server receives the new cookie upon reload.
    const newUrl = `${pathname}?${currentParams.toString()}`;
    window.location.href = newUrl;
  };

  if (!current) return null; // Prevents crash if language hasn't loaded yet

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1 border border-brandGray rounded-soft text-brandGrayDark hover:border-brandBlue hover:text-brandBlue transition"
      >
        {current.flag}
        {current.label}

        <svg
          className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
            }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 12l-6-6h12l-6 6z" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-28 bg-white border border-brandGray rounded-soft shadow-md transition-all duration-300 origin-top-right z-50 ${open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        {other.map((opt) => (
          <button
            key={opt.code}
            onClick={() => select(opt.code)}
            className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-brandGrayLight hover:text-brandBlue transition"
          >
            {opt.flag}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}