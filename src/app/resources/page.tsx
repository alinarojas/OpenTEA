// app/resources/page.tsx
import Link from "next/link";
import { cookies } from "next/headers"; 
import {
  FaChevronLeft,
  FaGraduationCap,
  FaPodcast,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { highlightEmphasis } from "@/src/utils/formatEmphasis";

// --- Types ---
type LocalizedText = { en: string; es: string };

type Resource = {
  id: string;
  title: LocalizedText; 
  provider: LocalizedText;
  type: LocalizedText;
  description: LocalizedText;
  link: string;
  icon: any;
  iconColor: string;
  iconBg: string;
};

// --- Translations ---
const uiTranslations = {
  en: {
    back: "Back to home",
    title: "Learning resources",
    subtitle: "A collection of *free resources* we've found helpful for learning more about autism.",
    view: "View Resource",
    by: "By",
  },
  es: {
    back: "Volver al inicio",
    title: "Recursos de aprendizaje",
    subtitle: "Una colección de *recursos gratuitos* que nos han resultado útiles para aprender más sobre autismo.",
    view: "Ver recurso",
    by: "Por",
  }
};
const resources: Resource[] = [
  {
    id: "orange-uam-course",
    title: {
      en: "Mobile apps and other technologies for people with ASD",
      es: "Aplicaciones móviles y otras tecnologías para personas con TEA",
    },
    provider: {
      en: "Orange Foundation & Autonomous University of Madrid (UAM)",
      es: "Fundación Orange & Universidad Autónoma de Madrid (UAM)",
    },
    type: { en: "Course", es: "Curso" },
    description: {
      en: "A comprehensive MOC designed to teach how to use mobile technology to support autistic people.",
      es: "Un curso online diseñado para enseñar cómo usar la tecnología móvil para apoyar a personas autistas.",
    },
    link: "https://online.orangedigitalcenter.es/courses/289",
    icon: FaGraduationCap,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    id: "gatea-podcast",
    title: {
      en: "Gatea Podcast: The Autism Podcast",
      es: "Gatea Podcast: El Podcast del Autismo",
    },
    provider: {
      en: "Gatea Atención Global",
      es: "Gatea Atención Global",
    },
    type: { en: "Podcast", es: "Podcast" },
    description: {
      en: "An informative audio series featuring professionals discussing therapies, daily life strategies, diagnosis, and family support.",
      es: "Una serie de audio informativa con profesionales que analizan terapias, estrategias de la vida diaria, diagnóstico y apoyo familiar.",
    },
    link: "https://www.youtube.com/@gateaatencionglobal9101/videos",
    icon: FaPodcast,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
];

// --- Main Page (Server Component) ---
export default async function ResourcesPage() {
  // 1. Get language on the server
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "es") as "en" | "es";
  const rawUi = uiTranslations[lang];

  // 2. Apply formatting only to the strings that need it
  const formattedSubtitle = highlightEmphasis(rawUi.subtitle, true);

  return (
    <main className="bg-gradient-to-r from-[#F7FAFF] via-[#FDFCFB] to-[#F3FBF6]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">

        <Link href="/" className="group inline-flex items-center text-sm font-medium text-brandGrayDark hover:text-brandBlue mb-8 transition-colors">
          <div className="mr-2 p-1 rounded-full group-hover:bg-brandBlue/10 transition-colors">
            <FaChevronLeft className="w-3 h-3" />
          </div>
          {rawUi.back}
        </Link>

        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-brandGrayDark mb-4">
            {rawUi.title}
          </h1>
          {/* 3. Use dangerouslySetInnerHTML to render the formatted HTML */}
          <p 
            className="text-lg text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedSubtitle }}
          />
        </div>

        {/* Flex Container */}
        <div className="flex flex-wrap gap-4 md:gap-12 justify-center mb-20">
          {resources.map((res) => (
            <div
              key={res.id}
              className="group flex flex-col justify-between bg-white rounded-3xl border border-brandGray p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 w-full md:flex-1 md:min-w-[45%] lg:min-w-[30%] lg:max-w-[32.5%]"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${res.iconBg} ${res.iconColor}`}>
                    <res.icon className="text-xl" />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {res.type[lang]}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <h2 className="text-xl font-bold text-brandGrayDark leading-tight group-hover:text-brandBlue transition-colors">
                    {res.title[lang]}
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    {rawUi.by} {res.provider[lang]}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {res.description[lang]}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-brandGrayLight">
                {/* Note: changed target="_blank" Link to <a> tag as Link is for internal routing */}
                <a 
                  href={res.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brandBlue hover:underline"
                >
                  {rawUi.view} <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}