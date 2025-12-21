import { getApps } from "@/src/lib/getApps";
import Hero from "@/components/Hero";
import BrandSlogan from "@/components/BrandSlogan";
import Principles from "@/components/Principles";
import { cookies } from "next/headers";
import {
  AacCategoryRow,
  RoutinesCategoryRow,
  SocialSkillsCategoryRow,
} from "@/components/HomeCategories";

// Define the type locally or import it if shared
type Lang = "en" | "es";

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get("lang")?.value;

  // Validate the cookie value. Fallback to 'es' if invalid or missing.
  const lang: Lang = (cookieVal === "en" || cookieVal === "es") ? cookieVal : "es";

  const apps = await getApps(lang);

  return (
    <main>
      <Hero lang={lang} />
      <BrandSlogan lang={lang} />
      <Principles lang={lang} />
      
      <section className="space-y-2">
        <AacCategoryRow apps={apps} lang={lang} />
        <RoutinesCategoryRow apps={apps} lang={lang} />
        <SocialSkillsCategoryRow apps={apps} lang={lang} />
      </section>
    </main>
  );
}