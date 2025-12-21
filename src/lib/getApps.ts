// src/lib/getApps.ts
import { supabase } from "./supabaseClient";

export async function getApps(lang: "en" | "es" = "en") {
  // 1. Obtenemos las APPS y sus TAGS originales (en inglés)
  // Nota: Pedimos 'tag_id' dentro de app_tags para poder buscar su traducción después
  const { data: apps, error: appsError } = await supabase
    .from("apps")
    .select(`
      *,
      app_tags (
        tag_id,
        tags ( name )
      ),
      app_languages ( lang_code )
    `)
    .eq("is_active", true);

  if (appsError) {
    console.error("Error fetching apps:", appsError);
    return [];
  }

  if (!apps || apps.length === 0) return [];

  // 2. Obtenemos las TRADUCCIONES necesarias
  // Buscamos traducciones tanto para 'apps' como para 'tags' en el idioma seleccionado
  const { data: translations, error: transError } = await supabase
    .from("translations")
    .select("*")
    .eq("lang_code", lang)
    .in("table_name", ["apps", "tags"]);

  if (transError) {
    console.error("Error fetching translations:", transError);
    // Si falla la traducción, devolvemos las apps tal cual (en inglés)
    return apps.map(formatAppFallback);
  }

  // 3. COMBINAMOS los datos en JavaScript
  return apps.map((app) => {
    // Función helper para buscar una traducción específica en el array que bajamos
    const translate = (tableName: string, rowId: number, field: string, fallback: string) => {
      const found = translations?.find(
        (t) =>
          t.table_name === tableName &&
          t.row_id === rowId &&
          t.column_name === field
      );
      return found ? found.translated_text : fallback;
    };

    // Procesar etiquetas: Array de objetos -> Array de strings traducidos
    const processedTags = app.app_tags?.map((item: any) => {
      const originalName = item.tags?.name || "";
      const tagId = item.tag_id;
      // Buscamos si existe traducción para este tag ID
      return translate("tags", tagId, "name", originalName);
    });

    return {
      ...app,
      // Traducimos campos de la app
      name: translate("apps", app.id, "name", app.name),
      short_description: translate("apps", app.id, "short_description", app.short_description),
      long_description: translate("apps", app.id, "long_description", app.long_description),
      // Asignamos los tags ya procesados
      tags: processedTags || [],
      // Aplanamos idiomas
      languages: app.app_languages?.map((l: any) => l.lang_code) || [],
    };
  });
}

// Helper por si fallan las traducciones totalmente, para que no rompa la web
function formatAppFallback(app: any) {
  return {
    ...app,
    tags: app.app_tags?.map((t: any) => t.tags?.name) || [],
    languages: app.app_languages?.map((l: any) => l.lang_code) || [],
  };
}