"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { 
  FaInfoCircle, 
  FaTimes, 
  FaRegSmile, 
  FaBrain, 
  FaRegEye 
} from "react-icons/fa";

// --- Translations ---
const translations = {
  en: {
    ariaLabel: "How to read ratings",
    title: "How to read ratings",
    easeTitle: "Ease of Use",
    easeDesc: "Higher is better. Indicates an intuitive interface that requires less motor skill.",
    cogTitle: "Cognitive Load",
    cogDesc: "Depends on your goal:",
    cogLow: "Low (1-2): Relaxation",
    cogHigh: "High (3-5): Learning",
    sensoryTitle: "Sensory Load",
    sensoryDesc: "Lower is better for users with sensory sensitivities (fewer flashing lights or sounds).",
    closeBtn: "Got it"
  },
  es: {
    ariaLabel: "Cómo leer las puntuaciones",
    title: "Cómo leer las puntuaciones",
    easeTitle: "Facilidad de uso",
    easeDesc: "Cuanto más alto, mejor. Indica una interfaz intuitiva que requiere menos habilidad motriz.",
    cogTitle: "Carga cognitiva",
    cogDesc: "Depende de tu objetivo:",
    cogLow: "Baja (1-2): Relax",
    cogHigh: "Alta (3-5): Aprendizaje",
    sensoryTitle: "Carga sensorial",
    sensoryDesc: "Baja es mejor para usuarios con sensibilidad sensorial (menos luces o sonidos intensos).",
    closeBtn: "Entendido"
  }
};

export function RatingInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "es">("es");

  // Sync language with cookie on mount and when modal opens
  useEffect(() => {
    const currentLang = (Cookies.get("lang") || "es") as "en" | "es";
    setLang(currentLang);
  }, [isOpen]);

  const t = translations[lang];

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="ml-2 text-brandBlue hover:text-brandBlue/80 transition-colors focus:outline-none"
        aria-label={t.ariaLabel}
        type="button"
      >
        <FaInfoCircle className="w-4 h-4" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop with Blur */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button Icon */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            {/* Header */}
            <h3 className="text-xl font-bold text-brandGrayDark mb-6 pr-8">
              {t.title}
            </h3>

            {/* Content List */}
            <ul className="space-y-6">
              
              {/* Ease of Use */}
              <li className="flex gap-3">
                <div className="flex flex-col items-center gap-2 shrink-0 w-6">
                    <div className="w-1.5 h-full bg-brandBlue rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaRegSmile className="text-brandBlue w-4 h-4" />
                    <h4 className="text-sm font-bold text-brandGrayDark">{t.easeTitle}</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.easeDesc}
                  </p>
                </div>
              </li>

              {/* Cognitive Load */}
              <li className="flex gap-3">
                <div className="flex flex-col items-center gap-2 shrink-0 w-6">
                    <div className="w-1.5 h-full bg-purple-400 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaBrain className="text-purple-400 w-4 h-4" />
                    <h4 className="text-sm font-bold text-brandGrayDark">{t.cogTitle}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{t.cogDesc}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-purple-50 text-purple-700 px-2 py-1.5 rounded-lg font-medium border border-purple-100 text-center">
                      {t.cogLow}
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-1.5 rounded-lg font-medium border border-purple-100 text-center">
                      {t.cogHigh}
                    </span>
                  </div>
                </div>
              </li>

              {/* Sensory Load */}
              <li className="flex gap-3">
                <div className="flex flex-col items-center gap-2 shrink-0 w-6">
                    <div className="w-1.5 h-full bg-teal-600 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaRegEye className="text-teal-600 w-4 h-4" />
                    <h4 className="text-sm font-bold text-brandGrayDark">{t.sensoryTitle}</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t.sensoryDesc}
                  </p>
                </div>
              </li>
            </ul>

            {/* Footer Button */}
            <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brandBlue/50"
                >
                    {t.closeBtn}
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}