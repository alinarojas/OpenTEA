"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faUniversalAccess, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

// Translations
const translations = {
  en: {
    clarity: {
      title: "Clarity above all",
      text: "We rate every app on Ease of Use so you can find tools that are intuitive and frustration-free",
    },
    accessibility: {
      title: "Neurodivergent focus",
      text: "Specific ratings for Cognitive Load and Sensory Impact to ensure the app fits your specific needs",
    },
    trust: {
      title: "Complete & Honest",
      text: "A comprehensive directory of both free and paid apps, evaluated with transparent criteria for the ASD community",
    },
  },
  es: {
    clarity: {
      title: "Claridad ante todo",
      text: "Valoramos cada app por su Facilidad de Uso para que encuentres herramientas intuitivas y sin frustraciones",
    },
    accessibility: {
      title: "Enfoque neurodivergente",
      text: "Calificaciones específicas de Carga Cognitiva e Impacto Sensorial para asegurar que la app se ajuste a tus necesidades",
    },
    trust: {
      title: "Completo y honesto",
      text: "Un directorio integral de apps gratuitas y de pago, evaluadas con criterios transparentes para la comunidad TEA",
    },
  },
};

export default function Principles({ lang = "es" }: { lang?: string }) {
  const content = translations[lang as keyof typeof translations] || translations.es;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 space-y-15 md:space-y-0 md:grid-cols-3 gap-10 text-center">
      {/* PRINCIPLE 1 */}
      <div className="space-y-4 px-4">
        <FontAwesomeIcon icon={faEye} className="text-brandBlue text-4xl" />
        <h3 className="text-2xl font-semibold text-brandGrayDark">
          {content.clarity.title}
        </h3>
        <p className="text-brandGrayDark/80 text-lg">
          {content.clarity.text}
        </p>
      </div>

      {/* PRINCIPLE 2 */}
      <div className="space-y-4 px-4">
        <FontAwesomeIcon icon={faUniversalAccess} className="text-brandGreen text-4xl" />
        <h3 className="text-2xl font-semibold text-brandGrayDark">
          {content.accessibility.title}
        </h3>
        <p className="text-brandGrayDark/80 text-lg">
          {content.accessibility.text}
        </p>
      </div>

      {/* PRINCIPLE 3 */}
      <div className="space-y-4 px-4">
        <FontAwesomeIcon icon={faShieldHalved} className="text-brandBrown text-4xl" />
        <h3 className="text-2xl font-semibold text-brandGrayDark">
          {content.trust.title}
        </h3>
        <p className="text-brandGrayDark/80 text-lg">
          {content.trust.text}
        </p>
      </div>
    </section>
  );
}