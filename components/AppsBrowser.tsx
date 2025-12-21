"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppsGrid } from "./AppGrid";
import { RatingInfo } from "./RatingInfo"; 
import { FaRegSmile, FaBrain, FaRegEye, FaFilter, FaChevronDown, FaChevronUp } from "react-icons/fa";

// --- TRANSLATIONS ---
const tBrowser = {
  en: {
    filters: "Filters",
    active: "Active",
    removeAll: "Remove all",
    priceRange: "PRICE RANGE",
    clear: "Clear",
    allPrices: "All prices",
    free: "FREE",
    paid: "PAID / SUBSCRIPTION",
    category: "CATEGORY",
    all: "All",
    platform: "PLATFORM",
    language: "LANGUAGE",
    accessibility: "ACCESSIBILITY",
    minEase: "Min. Ease of Use",
    maxCog: "Max. Cognitive Load",
    maxSens: "Max. Sensory Load",
    showResults: "Show Results",
    searchPlaceholder: "Search apps by name…",
    appsCount: "apps",
    appCount: "app",
    sortName: "Name (A-Z)",
    sortEase: "Ease of Use (High-Low)",
    sortCog: "Cognitive Load (High-Low)",
    sortSens: "Sensory Load (High-Low)",
    prev: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  es: {
    filters: "Filtros",
    active: "Activos",
    removeAll: "Borrar todo",
    priceRange: "RANGO DE PRECIO",
    clear: "Limpiar",
    allPrices: "Todos los precios",
    free: "GRATIS",
    paid: "PAGO / SUSCRIPCIÓN",
    category: "CATEGORÍA",
    all: "Todas",
    platform: "PLATAFORMA",
    language: "IDIOMA",
    accessibility: "ACCESIBILIDAD",
    minEase: "Mín. Facilidad de uso",
    maxCog: "Máx. Carga cognitiva",
    maxSens: "Máx. Carga sensorial",
    showResults: "Mostrar resultados",
    searchPlaceholder: "Buscar apps por nombre…",
    appsCount: "apps",
    appCount: "app",
    sortName: "Nombre (A-Z)",
    sortEase: "Facilidad (Alta-Baja)",
    sortCog: "Carga Cognitiva (Alta-Baja)",
    sortSens: "Carga Sensorial (Alta-Baja)",
    prev: "Anterior",
    next: "Siguiente",
    page: "Página",
    of: "de",
  }
};

interface AppsBrowserProps {
  apps: any[];
  lang: "en" | "es"; // Added lang prop
}

type PriceFilter = "all" | "free" | "paid";
type SortOption = "name" | "ease" | "cognitive" | "sensory";

const ITEMS_PER_PAGE = 12;

function isFree(app: any) {
  const t = app.price_type;
  return t === "free" || t === "freemium";
}

function isPaid(app: any) {
  const t = app.price_type;
  return t === "paid" || t === "subscription";
}

function getPrice(app: any) {
  if (app.price_amount != null) {
    const v = Number(app.price_amount);
    return Number.isNaN(v) ? 0 : v;
  }
  return isFree(app) ? 0 : 0;
}

// Helper to convert 'en' -> 'English' based on current locale
function getLanguageName(code: string, locale: string): string {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'language' });
    return displayNames.of(code) || code.toUpperCase();
  } catch (e) {
    return code.toUpperCase();
  }
}

export function AppsBrowser({ apps, lang }: AppsBrowserProps) {
  const searchParams = useSearchParams();
  const t = tBrowser[lang] || tBrowser.en; // Select translation

  // 1. Calculate Global Bounds
  const { globalMin, globalMax } = useMemo(() => {
    let min = 0;
    let max = 50;
    const prices = apps
      .map((a) => getPrice(a))
      .filter((p) => p !== null && p !== undefined);
    
    if (prices.length > 0) {
      min = Math.min(...prices);
      max = Math.max(...prices);
    }
    return { globalMin: min, globalMax: max };
  }, [apps]);

  // ---------- STATE ----------
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("ease"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return searchParams.get("category") || "";
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  
  const [minEase, setMinEase] = useState<string>("");
  const [maxCognitive, setMaxCognitive] = useState<string>("");
  const [maxSensory, setMaxSensory] = useState<string>("");
  
  const [priceMin, setPriceMin] = useState<number>(globalMin);
  const [priceMax, setPriceMax] = useState<number>(globalMax);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    setSelectedCategory(cat || "");
  }, [searchParams]);

  // ---------- FILTER LOGIC ----------
  const checkCriteria = useCallback(
    (
      app: any,
      filters: {
        search?: string;
        category?: string;
        platforms?: string[];
        language?: string;
        pFilter?: PriceFilter;
        pMin?: number;
        pMax?: number;
        ease?: string;
        cog?: string;
        sens?: string;
      }
    ) => {
      // 1. Search
      if (filters.search) {
        const haystack = `${app.name ?? ""} ${app.short_description ?? ""}`.toLowerCase();
        if (!haystack.includes(filters.search)) return false;
      }
      
      // 2. Category
      if (filters.category) {
        const tags: string[] = app.tags ?? [];
        const filterLower = filters.category.toLowerCase();
        // Since tags are localized in the DB or props, we match directly
        const hasMatch = tags.some(tag => tag.toLowerCase() === filterLower);
        if (!hasMatch) return false;
      }

      // 3. Price Type
      const currentPFilter = filters.pFilter ?? "all";
      if (currentPFilter === "free" && !isFree(app)) return false;
      if (currentPFilter === "paid" && !isPaid(app)) return false;
      
      // 4. Price Range
      const p = getPrice(app);
      const min = filters.pMin ?? globalMin;
      const max = filters.pMax ?? globalMax;
      if (currentPFilter !== "free") { 
         if (p < min || p > max) return false;
      }
      // 5. Platforms
      if (filters.platforms && filters.platforms.length > 0) {
        const appPlats: string[] = app.platforms ?? [];
        const hasAny = filters.platforms.some((pl) => appPlats.includes(pl));
        if (!hasAny) return false;
      }
      // 6. Language
      if (filters.language) {
        const langs: string[] = app.languages ?? [];
        if (!langs.includes(filters.language)) return false;
      }
      // 7. Ratings
      const minEaseNum = filters.ease ? Number(filters.ease) : null;
      if (minEaseNum !== null && (app.ease_of_use ?? 0) < minEaseNum) return false;

      const maxCogNum = filters.cog ? Number(filters.cog) : null;
      if (maxCogNum !== null && (app.cognitive_load ?? 10) > maxCogNum) return false;

      const maxSensNum = filters.sens ? Number(filters.sens) : null;
      if (maxSensNum !== null && (app.sensory_load ?? 10) > maxSensNum) return false;

      return true;
    },
    [globalMin, globalMax]
  );

  // 1. Get Main List
  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    
    const result = apps.filter((app) =>
      checkCriteria(app, {
        search: q,
        category: selectedCategory || undefined,
        platforms: selectedPlatforms,
        language: selectedLanguage || undefined,
        pFilter: priceFilter,
        pMin: priceMin,
        pMax: priceMax,
        ease: minEase,
        cog: maxCognitive,
        sens: maxSensory,
      })
    );

    return result.sort((a, b) => {
      switch (sortOption) {
        case "ease":
          return (b.ease_of_use ?? 0) - (a.ease_of_use ?? 0);
        case "cognitive":
          return (b.cognitive_load ?? 0) - (a.cognitive_load ?? 0);
        case "sensory":
          return (b.sensory_load ?? 0) - (a.sensory_load ?? 0);
        case "name":
        default:
          return (a.name ?? "").localeCompare(b.name ?? "");
      }
    });

  }, [
    apps, checkCriteria, search, sortOption, selectedCategory, 
    selectedPlatforms, selectedLanguage, priceFilter, priceMin, 
    priceMax, minEase, maxCognitive, maxSensory,
  ]);

  // Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search, selectedCategory, selectedPlatforms, selectedLanguage, 
    priceFilter, priceMin, priceMax, minEase, maxCognitive, 
    maxSensory, sortOption
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApps.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredApps, currentPage]);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  // Counts
  const { categoryCounts, platformCounts, languageCounts, priceTypeCounts } = useMemo(() => {
     const q = search.trim().toLowerCase();
     const baseFilters = {
        search: q, category: selectedCategory || undefined, platforms: selectedPlatforms,
        language: selectedLanguage || undefined, pFilter: priceFilter, pMin: priceMin,
        pMax: priceMax, ease: minEase, cog: maxCognitive, sens: maxSensory
     };

     const appsForCats = apps.filter(a => checkCriteria(a, { ...baseFilters, category: undefined }));
     const catMap = new Map<string, number>();
     appsForCats.forEach(app => app.tags?.forEach((t: string) => catMap.set(t, (catMap.get(t) ?? 0) + 1)));

     const appsForPlats = apps.filter(a => checkCriteria(a, { ...baseFilters, platforms: [] }));
     const platMap = new Map<string, number>();
     appsForPlats.forEach(app => app.platforms?.forEach((p: string) => platMap.set(p, (platMap.get(p) ?? 0) + 1)));

     const appsForLangs = apps.filter(a => checkCriteria(a, { ...baseFilters, language: undefined }));
     const langMap = new Map<string, number>();
     appsForLangs.forEach(app => app.languages?.forEach((l: string) => langMap.set(l, (langMap.get(l) ?? 0) + 1)));

     const appsForPrice = apps.filter(a => checkCriteria(a, { ...baseFilters, pFilter: undefined, pMin: globalMin, pMax: globalMax }));
     let free = 0, paid = 0, all = appsForPrice.length;
     appsForPrice.forEach(a => { if(isFree(a)) free++; if(isPaid(a)) paid++; });

     return { categoryCounts: catMap, platformCounts: platMap, languageCounts: langMap, priceTypeCounts: { all, free, paid } };
  }, [apps, checkCriteria, search, selectedCategory, selectedPlatforms, selectedLanguage, priceFilter, priceMin, priceMax, minEase, maxCognitive, maxSensory, globalMin, globalMax]);

  // Handlers
  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const val = Math.min(v, priceMax - 1);
    setPriceMin(val);
  };
  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const val = Math.max(v, priceMin + 1);
    setPriceMax(val);
  };
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]);
  };
  const resetAllFilters = () => {
    setSearch(""); setSortOption("ease"); setPriceFilter("all");
    setSelectedCategory(""); setSelectedPlatforms([]); setSelectedLanguage("");
    setMinEase(""); setMaxCognitive(""); setMaxSensory("");
    setPriceMin(globalMin); setPriceMax(globalMax);
  };
  
  const getPercent = (value: number) => Math.round(((value - globalMin) / (globalMax - globalMin)) * 100);
  const isPriceDisabled = priceFilter === "free";
  const hasActiveFilters = search !== "" || priceFilter !== "all" || selectedCategory !== "" || selectedPlatforms.length > 0 || selectedLanguage !== "" || minEase !== "" || maxCognitive !== "" || maxSensory !== "" || priceMin !== globalMin || priceMax !== globalMax;

  // --- RATING GROUP ---
  const RatingGroup = ({ 
    label, 
    value, 
    onChange, 
    mode, 
    Icon, 
    activeColorClass, 
    textColorClass 
  }: { 
    label: string, 
    value: string, 
    onChange: (v: string) => void, 
    mode: "min" | "max",
    Icon: React.ElementType,
    activeColorClass: string,
    textColorClass: string
  }) => {
    const current = value ? Number(value) : null;

    return (
      <div className="mb-4">
        {/* Header with Icon */}
        <div className="flex items-center gap-2 mb-2.5">
            <Icon className={`w-4 h-4 ${textColorClass}`} />
            <p className="text-[11px] font-bold text-brandGrayDark uppercase tracking-wide">{label}</p>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(num => {
                const isActive = current !== null && num === current;
                let isInRange = false;
                if (current !== null && !isActive) {
                  if (mode === "min") {
                    isInRange = num > current;
                  } else {
                    isInRange = num < current;
                  }
                }

                let buttonClass = "flex-1 h-8 rounded text-xs font-bold transition-all border flex items-center justify-center ";
                
                if (isActive) {
                   buttonClass += `${activeColorClass} text-white border-transparent shadow-sm`;
                } else if (isInRange) {
                   buttonClass += `${activeColorClass} bg-opacity-30 ${textColorClass} border-transparent`;
                } else {
                   buttonClass += "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50";
                }

                return (
                    <button key={num} onClick={() => onChange(isActive ? "" : num.toString())}
                        className={buttonClass}
                        title={mode === "min" ? `${num} or more` : `${num} or less`}>
                        {mode === "min" ? num + "+" : "≤" + num}
                    </button>
                )
            })}
        </div>
      </div>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <style jsx>{`
        .range-slider-input { pointer-events: none; }
        .range-slider-input::-webkit-slider-thumb {
          pointer-events: auto; appearance: none; height: 1.25rem; width: 1.25rem;
          background: #ffffff; border-radius: 9999px; border: 1px solid #d1d5db;
          cursor: pointer; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        .range-slider-input::-moz-range-thumb {
          pointer-events: auto; appearance: none; height: 1.25rem; width: 1.25rem;
          background: #ffffff; border-radius: 9999px; border: 1px solid #d1d5db;
          cursor: pointer; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
      `}</style>

      {/* MOBILE TOGGLE BUTTON */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full p-4 bg-white border border-brandGray rounded-xl shadow-sm text-brandGrayDark font-semibold"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-brandBlue" />
            <span>{t.filters} {hasActiveFilters && <span className="ml-1 text-xs bg-brandBlue text-white px-2 py-0.5 rounded-full">{t.active}</span>}</span>
          </div>
          {showFilters ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className={`lg:block lg:w-72 w-full lg:shrink-0 bg-white border border-brandGray rounded-2xl p-4 space-y-6 self-start shadow-sm transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-brandGray min-h-[32px]">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brandBlue/10 text-brandBlue">
                <FaFilter className="w-3 h-3" />
              </span>
              <h2 className="text-sm font-semibold text-brandGrayDark">{t.filters}</h2>
            </div>
            {hasActiveFilters && (
              <button onClick={resetAllFilters} className="text-[10px] font-medium text-red-500 hover:text-red-600 underline">{t.removeAll}</button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-brandGrayDark tracking-wide">{t.priceRange}</h3>
              {(priceFilter !== "all" || priceMin !== globalMin || priceMax !== globalMax) && (
                <button onClick={() => { setPriceFilter("all"); setPriceMin(globalMin); setPriceMax(globalMax); }} className="text-[10px] text-gray-400 hover:text-brandBlue">{t.clear}</button>
              )}
            </div>

            <div className={`space-y-4 ${isPriceDisabled ? "opacity-50 grayscale" : ""}`}>
              {/* SLIDER */}
              <div className="relative w-full h-8 flex items-center">
                 <div className="absolute left-0 w-full h-1.5 bg-gray-200 rounded-full"></div>
                 <div className="absolute h-1.5 bg-brandBlue rounded-full" style={{ left: `${isPriceDisabled ? 0 : getPercent(priceMin)}%`, right: `${isPriceDisabled ? 0 : 100 - getPercent(priceMax)}%` }}></div>
                 <input type="range" min={globalMin} max={globalMax} value={isPriceDisabled ? globalMin : priceMin} onChange={handlePriceMinChange} disabled={isPriceDisabled} className={`range-slider-input absolute w-full h-full appearance-none bg-transparent ${getPercent(priceMin) > 50 ? 'z-40' : 'z-20'}`} />
                 <input type="range" min={globalMin} max={globalMax} value={isPriceDisabled ? globalMin : priceMax} onChange={handlePriceMaxChange} disabled={isPriceDisabled} className="range-slider-input absolute w-full h-full appearance-none bg-transparent z-30" />
              </div>
              <div className="flex justify-between text-xs text-brandGrayDark font-medium">
                 <span>{isPriceDisabled ? 0 : priceMin}€</span>
                 <span>{isPriceDisabled ? 0 : priceMax}€</span>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-xs">
              {[
                  { id: "all", label: t.allPrices, count: priceTypeCounts.all },
                  { id: "free", label: t.free, count: priceTypeCounts.free },
                  { id: "paid", label: t.paid, count: priceTypeCounts.paid }
              ].map((opt) => (
                <button key={opt.id} type="button" onClick={() => setPriceFilter(opt.id as PriceFilter)} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 transition-colors ${priceFilter === opt.id ? "bg-brandBlue/10 text-brandBlue font-medium" : "text-brandGrayDark hover:bg-gray-50"}`}>
                  <span>{opt.label}</span><span className="text-gray-400 font-normal">({opt.count})</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-brandGray" />
          
          {/* CATEGORY */}
          <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-brandGrayDark">{t.category}</h3>
                {selectedCategory && <button onClick={() => setSelectedCategory("")} className="text-[10px] text-gray-400 hover:text-brandBlue">{t.clear}</button>}
            </div>
            <div className="space-y-1 text-xs max-h-48 overflow-y-auto custom-scrollbar">
              <button type="button" onClick={() => setSelectedCategory("")} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 ${!selectedCategory ? "bg-brandBlue/10 text-brandBlue font-medium" : "text-brandGrayDark hover:bg-gray-50"}`}>
                <span>{t.all}</span><span className="text-gray-400 font-normal">({apps.length})</span>
              </button>
              {Array.from(categoryCounts.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([value, count]) => {
                const isActive = selectedCategory.toLowerCase() === value.toLowerCase();
                return (
                  <button key={value} type="button" onClick={() => setSelectedCategory(value)} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 ${isActive ? "bg-brandBlue/10 text-brandBlue font-medium" : "text-brandGrayDark hover:bg-gray-50"}`}>
                      <span className="truncate text-left">{value}</span><span className="text-gray-400 font-normal ml-2">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brandGray" />
          
          {/* PLATFORMS */}
          <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-brandGrayDark">{t.platform}</h3>
                {selectedPlatforms.length > 0 && <button onClick={() => setSelectedPlatforms([])} className="text-[10px] text-gray-400 hover:text-brandBlue">{t.clear}</button>}
            </div>
            <div className="space-y-1 text-xs">
              {Array.from(platformCounts.entries()).map(([value, count]) => {
                const active = selectedPlatforms.includes(value);
                return (
                  <button key={value} type="button" onClick={() => togglePlatform(value)} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 ${active ? "bg-green-100 text-green-700 font-medium" : "text-brandGrayDark hover:bg-gray-50"}`}>
                    <span>{value}</span><span className="text-gray-400 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-brandGray" />

          {/* LANGUAGE */}
          <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-brandGrayDark">{t.language}</h3>
                {selectedLanguage && <button onClick={() => setSelectedLanguage("")} className="text-[10px] text-gray-400 hover:text-brandBlue">{t.clear}</button>}
            </div>
            <div className="space-y-1 text-xs">
              <button type="button" onClick={() => setSelectedLanguage("")} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 ${!selectedLanguage ? "bg-brandBlue/10 text-brandBlue font-medium" : "text-brandGrayDark hover:bg-gray-50"}`}>
                <span>{t.all}</span>
              </button>
              {Array.from(languageCounts.entries()).map(([value, count]) => (
                <button key={value} type="button" onClick={() => setSelectedLanguage(value)} className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 ${selectedLanguage === value ? "bg-brandBlue/10 text-brandBlue font-medium" : "text-brandGrayDark hover:bg-gray-50"}`}>
                  {/* Pass the current LANG to getLanguageName so it returns 'Español' when site is in Spanish */}
                  <span>{getLanguageName(value, lang)}</span>
                  <span className="text-gray-400 font-normal">({count})</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-brandGray" />

          {/* RATINGS */}
          <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-semibold text-brandGrayDark">{t.accessibility}</h3>
                    <RatingInfo />
                </div>
                {(minEase || maxCognitive || maxSensory) && <button onClick={() => { setMinEase(""); setMaxCognitive(""); setMaxSensory(""); }} className="text-[10px] text-gray-400 hover:text-brandBlue">{t.clear}</button>}
            </div>
            
            <div className="space-y-6 pt-1">
                <RatingGroup 
                    label={t.minEase} 
                    value={minEase} 
                    onChange={setMinEase} 
                    mode="min" 
                    Icon={FaRegSmile}
                    activeColorClass="bg-brandBlue"
                    textColorClass="text-brandBlue"
                />
                <RatingGroup 
                    label={t.maxCog} 
                    value={maxCognitive} 
                    onChange={setMaxCognitive} 
                    mode="max" 
                    Icon={FaBrain}
                    activeColorClass="bg-purple-400"
                    textColorClass="text-purple-400"
                />
                <RatingGroup 
                    label={t.maxSens} 
                    value={maxSensory} 
                    onChange={setMaxSensory} 
                    mode="max" 
                    Icon={FaRegEye}
                    activeColorClass="bg-teal-600"
                    textColorClass="text-teal-600"
                />
            </div>
          </div>
          
          {/* Mobile Apply Button */}
          <div className="lg:hidden pt-4 border-t border-brandGray">
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full py-3 bg-brandBlue text-white rounded-xl font-bold text-sm shadow-md"
            >
              {t.showResults} ({filteredApps.length})
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                </span>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} className="w-full h-12 rounded-xl border bg-white border-brandGray pl-11 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue/50 transition-shadow" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="text-xs font-medium text-brandGrayDark bg-brandGray/30 px-2 py-1 rounded-md">{filteredApps.length} {filteredApps.length === 1 ? t.appCount : t.appsCount}</span>
                </div>
            </div>
            <div className="relative w-full md:w-56 shrink-0">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z" clipRule="evenodd" /></svg>
               </span>
               <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="w-full h-12 appearance-none rounded-xl border border-brandGray bg-white pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brandBlue/50 cursor-pointer">
                 <option value="name">{t.sortName}</option>
                 <option value="ease">{t.sortEase}</option>
                 <option value="cognitive">{t.sortCog}</option>
                 <option value="sensory">{t.sortSens}</option>
               </select>
               <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
               </span>
            </div>
          </div>

          <AppsGrid apps={paginatedApps} lang={lang} />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === 1 ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-brandBlue"}`}>{t.prev}</button>
                <span className="text-sm font-medium text-gray-600">{t.page} <span className="text-gray-900">{currentPage}</span> {t.of} {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${currentPage === totalPages ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-brandBlue"}`}>{t.next}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}