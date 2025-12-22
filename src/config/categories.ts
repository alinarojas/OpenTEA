import {
  FaComments,
  FaRegCalendarCheck,
  FaUserFriends,
} from "react-icons/fa";

export type CategoryKey = "aac" | "routines" | "social";

export const CATEGORY_CONFIG = {
  aac: {
    slug: {
      en: "aac",
      es: "caa",
    },
    title: {
      en: "Communication & AAC",
      es: "Comunicación y CAA",
    },
    description: {
      en: "Apps that help autistic people express needs, choices, and ideas using symbols, pictures, or text-to-speech.",
      es: "Apps que ayudan a personas autistas a expresar necesidades, elecciones e ideas mediante símbolos, pictogramas o voz sintetizada.",
    },
    button: {
      en: "See communication apps",
      es: "Ver apps de comunicación",
    },
    matchTags: ["aac", "caa"],
    bgClass: "bg-[#EEF3FF]",
    iconClass: "text-[#4A72C2]",
    Icon: FaComments,
  },
  routines: {
    slug: {
      en: "visual schedules",
      es: "horarios visuales",
    },
    title: {
      en: "Routines & Daily Life",
      es: "Rutinas y vida diaria",
    },
    description: {
      en: "Visual schedules and step-by-step helpers that make daily routines clearer and more predictable.",
      es: "Horarios visuales y guías paso a paso que hacen las rutinas diarias más claras y previsibles.",
    },
    button: {
      en: "See routine helpers",
      es: "Ver apps para rutinas",
    },
    matchTags: ["visual schedule", "agenda", "visual"],
    bgClass: "bg-[#EDF8F2]",
    iconClass: "text-[#5CA97D]",
    Icon: FaRegCalendarCheck,
  },
  social: {
    slug: {
      en: "social skills",
      es: "habilidades sociales",
    },
    title: {
      en: "Social Stories & Situations",
      es: "Historias sociales y situaciones",
    },
    description: {
      en: "Visual narratives designed to help anticipate events, understand emotions and prepare for real-life daily situations.",
      es: "Narrativas visuales diseñadas para ayudar a anticipar eventos, comprender emociones y prepararse para situaciones de la vida diaria.",
    },
    button: {
      en: "See social stories",
      es: "Ver historias sociales",
    },
    matchTags: ["social skills", "habilidades sociales"],
    bgClass: "bg-[#FFF6EE]",
    iconClass: "text-[#C89A6A]",
    Icon: FaUserFriends,
  },
} as const;