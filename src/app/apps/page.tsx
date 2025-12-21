import { cookies } from "next/headers";
import { getApps } from "@/src/lib/getApps";
import { AppsBrowser } from "@/components/AppsBrowser";
import { FaChevronLeft } from "react-icons/fa";
import Link from "next/link";

// Page level translations
const pageTranslations = {
  en: {
    back: "Back to home",
    title: "Search apps"
  },
  es: {
    back: "Volver al inicio",
    title: "Buscar aplicaciones"
  }
};

type Lang = "en" | "es";

export default async function AppsPage() {
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get("lang")?.value;
  const lang: Lang = (cookieVal === "en" || cookieVal === "es") ? cookieVal : "es";

  // Get apps
  const apps = await getApps(lang);
  
  // Get UI translations
  const t = pageTranslations[lang];

  return (
    <main className="bg-gradient-to-r from-[#F7FAFF] via-[#FDFCFB] to-[#F3FBF6]">
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">

        {/* Breadcrumb */}
        <Link
          href="/"
          className="group inline-flex items-center text-sm font-medium text-brandGrayDark hover:text-brandBlue mb-8 transition-colors"
        >
          <div className="mr-2 p-1 rounded-full group-hover:bg-brandBlue/10 transition-colors">
            <FaChevronLeft className="w-3 h-3" />
          </div>
          {t.back}
        </Link>

        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-brandGrayDark">
            {t.title}
          </h1>
        </div>
      </div>
      
      {/* Pass lang to browser for internal UI translations */}
      <AppsBrowser apps={apps} lang={lang} />
    </main>
  );
}