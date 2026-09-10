import { defineRouting } from "next-intl/routing";

/**
 * Français et anglais, et rien d'autre (ADR-008, amendée le 9 septembre 2026 :
 * l'arabe et le sens droite-à-gauche sont retirés du périmètre).
 *
 * Le français est la langue par défaut : c'est celle du mouvement, et celle
 * dans laquelle le contenu arrive.
 */
export const LANGUES = ["fr", "en"] as const;
export type Langue = (typeof LANGUES)[number];

export const routage = defineRouting({
  locales: LANGUES,
  defaultLocale: "fr",
  // Le préfixe est toujours présent, y compris pour le français. Une URL sans
  // préfixe qui rend du français est une URL dont on ne peut pas dire, en la
  // lisant, ce qu'elle contient — et qui se met à mentir le jour où la langue
  // par défaut change.
  localePrefix: "always",
});
