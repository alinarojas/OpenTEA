// app/about/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import {
  FaChevronLeft,
  FaHeart,
  FaLightbulb,
  FaEnvelope,
  FaCode,
  FaUniversalAccess,
} from "react-icons/fa";


import { highlightEmphasis } from "@/src/utils/formatEmphasis";

// --- Translations ---
const translations = {
  en: {
    back: "Back to home",
    title: "About OpenTEA",
    subtitle: "A project born from the need to help families find the right technology without the frustration",
    
    // 1. Inspiration
    inspirationTitle: "Why I started this",
    inspirationText: "I have an autistic family member, and I've seen firsthand how hard it is to find the right tools. We often spent hours trying out apps, only to find they weren't right for our needs. Finding technology shouldn't be this hard or expensive for families.",

    // 2. What is OpenTEA
    meaningTitle: "What does OpenTEA mean?",
    // Syntax: __Bold__, __Blue__, *Green*
    meaningText: "The name OpenTEA reflects our mission. __TEA__ is the Spanish acronym for __Autism Spectrum Disorder__. The word __Open__ represents our promise of __Open Accessibility__: making sure technology is understandable, transparent, and easy to find for everyone.",

    // 3. Mission
    missionTitle: "How we help you",
    missionText: "Our goal is to **save you time and worry** by:",
    missionList: [
      "Gathering all helpful apps in one easy-to-use directory",
      "Evaluating apps based on how they affect senses and learning",
      "Sharing free resources so you don't have to guess what works"
    ],

    // 4. Open Source
    openSourceTitle: "A Community Project",
    openSourceText: "This is an **Open Source** project. This means the code is public so that other developers and families can help us improve the site and keep it free and updated forever.",

    contactTitle: "Have a question or a suggestion?",
    contactButton: "Send a message"
  },
  es: {
    back: "Volver al inicio",
    title: "Sobre OpenTEA",
    subtitle: "Un proyecto que nace de la necesidad de ayudar a las familias a encontrar tecnología sin frustraciones",
    
    // 1. Inspiration
    inspirationTitle: "Por qué empezó todo",
    inspirationText: "Tengo un familiar con autismo y he vivido de primera mano lo difícil que es encontrar las herramientas adecuadas. Pasamos horas probando apps que no encajaban con nuestras necesidades. Encontrar tecnología no debería ser tan difícil ni costoso para las familias.",

    // 2. What is OpenTEA
    meaningTitle: "¿Qué significa OpenTEA?",
    meaningText: "El nombre OpenTEA refleja nuestra misión. __TEA__ son las siglas de __Trastorno del Espectro Autista__. El término __Open__ representa nuestra promesa de __accesibilidad abierta__: asegurar que la tecnología sea comprensible, transparente y fácil de encontrar para todos.",

    // 3. Mission
    missionTitle: "Cómo te ayudamos",
    missionText: "Nuestro objetivo es **ahorrarte tiempo y preocupaciones** mediante:",
    missionList: [
      "Un directorio sencillo con todas las apps útiles en un solo lugar",
      "Evaluaciones basadas en cómo las apps afectan a los sentidos y al aprendizaje",
      "Recursos gratuitos para que no tengas que adivinar qué funciona"
    ],

    // 4. Open Source
    openSourceTitle: "Un proyecto de la comunidad",
    openSourceText: "Este es un proyecto de **Código Abierto (Open Source)**. Esto significa que el código es público para que otros desarrolladores y familias nos ayuden a mejorar y mantener el sitio gratuito siempre.",

    contactTitle: "¿Tienes alguna pregunta o sugerencia?",
    contactButton: "Enviar un mensaje"
  }
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "es") as "en" | "es";
  const content = translations[lang];

  return (
    <main className="bg-gradient-to-r from-[#F7FAFF] via-[#FDFCFB] to-[#F3FBF6]">
      <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
        
        {/* Back Link */}
        <Link
          href="/"
          className="group inline-flex items-center text-sm font-medium text-brandGrayDark hover:text-brandBlue mb-8 transition-colors"
        >
          <div className="mr-2 p-1 rounded-full group-hover:bg-brandBlue/10 transition-colors">
            <FaChevronLeft className="w-3 h-3" />
          </div>
          {content.back}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brandGrayDark mb-4">
            {content.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-brandGray p-8 md:p-12 shadow-sm space-y-10">
          
          {/* Section 1: The Inspiration */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                <FaHeart className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{content.inspirationTitle}</h2>
            </div>
            <p 
              className="text-gray-600 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: highlightEmphasis(content.inspirationText, true) }}
            />
          </section>

          <hr className="border-brandGrayLight" />

          {/* Section 2: Name Meaning & Accessibility */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-brandBlue/10 text-brandBlue rounded-xl">
             <FaUniversalAccess className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{content.meaningTitle}</h2>
            </div>
            <p 
              className="text-gray-600 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: highlightEmphasis(content.meaningText, true) }}
            />
          </section>

          <hr className="border-brandGrayLight" />

          {/* Section 3: The Mission */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                <FaLightbulb className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{content.missionTitle}</h2>
            </div>
            <p 
              className="text-gray-600 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: highlightEmphasis(content.missionText, true) }}
            />
            <ul className="space-y-4 mt-4">
              {content.missionList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-2 w-2 h-2 bg-brandGreen rounded-full shrink-0" />
                  <span 
                    className="text-lg"
                    dangerouslySetInnerHTML={{ __html: highlightEmphasis(item, false) }}
                  />
                </li>
              ))}
            </ul>
          </section>

          <hr className="border-brandGrayLight" />

          {/* Section 4: Open Source */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-brandGreen/10 text-brandGreen rounded-xl">
                <FaCode className="text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{content.openSourceTitle}</h2>
            </div>
            <p 
              className="text-gray-600 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: highlightEmphasis(content.openSourceText, true) }}
            />
          </section>

          <hr className="border-brandGrayLight" />

        </div>

        {/* Contact CTA */}
        {/* <div className="mt-12 text-center space-y-6">
          <h3 className="text-xl font-semibold text-brandGrayDark">
            {content.contactTitle}
          </h3>
          <a
            href="mailto:opentea@gmail.com"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-brandBlue text-white font-bold transition-all hover:bg-brandBlue/90 hover:shadow-xl hover:-translate-y-1"
          >
            <FaEnvelope />
            {content.contactButton}
          </a>
        </div> */}
      </div>
    </main>
  );
}