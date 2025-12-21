// app/components/AppCard.tsx
import Link from "next/link";
import {
  FaAndroid,
  FaApple,
  FaGlobe,
  FaWindows,
  FaLinux,
  FaMobileAlt,
  FaCircle,
  FaRegCircle,
  FaRegSmile,
} from "react-icons/fa";

// --- Translations ---
const cardTranslations = {
  en: {
    free: "FREE",
    freeIap: "FREE (IAP)",
    subscription: "SUBSCRIPTION",
    paid: "PAID",
    month: "MONTH",
    easeOfUse: "Ease of Use",
    viewApp: "View App",
  },
  es: {
    free: "GRATIS",
    freeIap: "GRATIS (IAP)",
    subscription: "SUSCRIPCIÓN",
    paid: "DE PAGO",
    month: "MES",
    easeOfUse: "Facilidad de uso",
    viewApp: "Ver App",
  },
};

interface AppCardProps {
  app: any;
  lang?: "en" | "es"; // Added lang prop
}

type PriceVariant = "green" | "yellow" | "default";

// Helper function now accepts the specific translation object 't'
function getPriceDisplay(
  app: any,
  t: typeof cardTranslations.en
): { label: string; variant: PriceVariant } {
  if (!app.price_type) {
    return { label: "—", variant: "default" };
  }

  const type = app.price_type.toLowerCase();

  // 1. FREE
  if (type === "free") {
    return { label: t.free, variant: "green" };
  }

  // 2. FREEMIUM
  if (type === "freemium") {
    return { label: t.freeIap, variant: "green" };
  }

  // 3. SUBSCRIPTION
  if (type === "subscription") {
    if (app.price_amount && app.currency) {
      return {
        // e.g., 10 EUR/MES
        label: `${app.price_amount} ${app.currency}/${t.month}`,
        variant: "yellow",
      };
    }
    return { label: t.subscription, variant: "yellow" };
  }

  // 4. PAID
  if (type === "paid") {
    if (app.price_amount && app.currency) {
      return {
        label: `${app.price_amount} ${app.currency}`,
        variant: "yellow",
      };
    }
    return { label: t.paid, variant: "yellow" };
  }

  return { label: t.paid, variant: "default" };
}

function platformIcon(platform: string) {
  const p = (platform || "").toLowerCase();
  if (p.includes("android")) return <FaAndroid />;
  if (p.includes("ios") || p.includes("iphone") || p.includes("ipad"))
    return <FaApple />;
  if (p.includes("windows")) return <FaWindows />;
  if (p.includes("linux")) return <FaLinux />;
  if (p.includes("web") || p.includes("browser")) return <FaGlobe />;
  return <FaMobileAlt />;
}

export function AppCard({ app, lang = "en" }: AppCardProps) {
  // Select translation based on lang prop
  const t = cardTranslations[lang] || cardTranslations.en;

  const { label: priceValue, variant: priceVariant } = getPriceDisplay(app, t);

  // --- Badge Styling ---
  const priceBadgeBase =
    "inline-flex items-center rounded-md px-2 py-1 text-[10px] sm:text-xs font-bold border ring-1 ring-inset uppercase tracking-wide ";

  const priceBadgeVariant =
    priceVariant === "green"
      ? "bg-green-50 text-green-700 border-green-200 ring-green-600/10"
      : priceVariant === "yellow"
      ? "bg-amber-50 text-amber-800 border-amber-200 ring-amber-600/10"
      : "bg-gray-50 text-gray-700 border-brandGray ring-gray-500/10";

  // --- Rating Render Logic ---
  const renderRating = (score: number | null) => {
    if (score == null)
      return <span className="text-brandGrayDark text-xs">—</span>;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {index <= score ? (
              <FaCircle className="text-brandBlue w-3 h-3" />
            ) : (
              <FaRegCircle className="text-gray-300 w-3 h-3" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="group relative flex flex-col justify-between h-full rounded-2xl border border-brandGray bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Top Section */}
      <div className="flex-1">
        <div className="flex flex-wrap items-start justify-between mb-4 gap-1">
          {/* --- PLATFORMS --- */}
          {app.platforms?.length ? (
            <div className="inline-flex items-center gap-1.5 bg-brandGrayLight rounded-xl px-2 h-7">
              {app.platforms.map((p: string, i: number) => (
                <span
                  key={p + i}
                  className="text-brandGrayDark/50 text-sm"
                  title={p}
                >
                  {platformIcon(p)}
                </span>
              ))}
            </div>
          ) : (
            <div className="h-7"></div>
          )}

          {/* Price Badge */}
          <span className={priceBadgeBase + priceBadgeVariant}>
            {priceValue}
          </span>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-brandBlue transition-colors truncate">
              {app.name}
            </h2>
            {app.short_description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-4 leading-relaxed">
                {app.short_description}
              </p>
            )}
          </div>
          {app.image_urls?.[0] && (
            <div className="shrink-0">
              <img
                src={app.image_urls[0]}
                alt={app.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 pt-4 border-t border-brandGray flex flex-wrap items-center justify-between gap-4 gap-y-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <FaRegSmile className="text-brandGrayDark" />
            <span>{t.easeOfUse}</span> {/* TRANSLATED */}
          </div>
          <div className="flex items-center gap-2">
            {renderRating(app.ease_of_use)}
            {app.ease_of_use && (
              <span className="text-xs font-medium text-brandGrayDark">
                {app.ease_of_use}/5
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/apps/${app.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brandBlue focus:outline-none focus:ring-2 focus:ring-brandBlue/50 whitespace-nowrap"
        >
          {t.viewApp} {/* TRANSLATED */}
        </Link>
      </div>
    </div>
  );
}