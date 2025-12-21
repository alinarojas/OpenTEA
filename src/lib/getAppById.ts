// src/lib/getAppById.ts
import { supabase } from "./supabaseClient";

export async function getAppById(id: number, lang: "en" | "es" = "en") {
  // 1. Obtener la App y sus Tags originales (en inglés)
  const { data: app, error } = await supabase
    .from("apps")
    .select(`
      *,
      app_tags (
        tag_id,
        tags ( id, name )
      ),
      app_languages ( lang_code )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching app by ID:", error);
    return null;
  }
  if (!app) return null;

  // 2. Si el idioma es inglés, devolvemos directo (ahorramos consultas)
  if (lang === "en") {
    return formatAppResponse(app, [], []);
  }

  // 3. Obtener traducciones de la APP (Título, descripciones)
  const { data: appTranslations } = await supabase
    .from("translations")
    .select("*")
    .eq("table_name", "apps")
    .eq("row_id", id)
    .eq("lang_code", lang);

  // 4. Obtener traducciones de los TAGS
  // Extraemos los IDs de los tags que tiene esta app
  const tagIds = app.app_tags?.map((at: any) => at.tag_id) || [];
  
  let tagTranslations: any[] = [];
  
  if (tagIds.length > 0) {
    const { data: tTrans } = await supabase
      .from("translations")
      .select("*")
      .eq("table_name", "tags")
      .in("row_id", tagIds)
      .eq("lang_code", lang);
    
    if (tTrans) tagTranslations = tTrans;
  }

  // 5. Mezclar todo
  return formatAppResponse(app, appTranslations || [], tagTranslations);
}

// --- Helper para mezclar datos y traducciones ---
function formatAppResponse(app: any, appTranslations: any[], tagTranslations: any[]) {
  // Helper para buscar traducción de texto
  const t = (field: string, fallback: string) => {
    const found = appTranslations.find((tr) => tr.column_name === field);
    return found ? found.translated_text : fallback;
  };

  // Procesar tags traducidos
  const processedTags = app.app_tags?.map((item: any) => {
    const originalName = item.tags?.name || "";
    const tagId = item.tag_id;
    
    // Buscar si existe traducción para este tag ID
    const foundTag = tagTranslations.find((tr) => tr.row_id === tagId);
    return foundTag ? foundTag.translated_text : originalName;
  });

  return {
    ...app,
    name: t("name", app.name),
    short_description: t("short_description", app.short_description),
    long_description: t("long_description", app.long_description),
    tags: processedTags || [],
    languages: app.app_languages?.map((l: any) => l.lang_code) || [],
  };
}