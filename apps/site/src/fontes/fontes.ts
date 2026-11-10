import fonteLocale from "next/font/local";

/**
 * Les deux fontes du site, déclarées UNE SEULE FOIS pour les trois racines
 * (le site public, l'administration, le formulaire de collecte).
 *
 * **Les fichiers sont dans le dépôt**, à côté de ce module, et servis par le
 * site lui-même. Un `@import` vers Google aurait fait partir, à chaque
 * visite, une requête vers un tiers : plus lente depuis le Maroc, et qui
 * apprend à ce tiers qui lit nos pages. C'est la règle S6 appliquée aux
 * fontes — on ne construit pas sur ce qu'on ne peut pas emporter.
 *
 * Jusqu'au 10 novembre 2026, la règle n'était tenue qu'à moitié :
 * `next/font/google` servait bien les fontes depuis le site, mais allait les
 * CHERCHER chez Google à chaque construction. Ce jour-là, Google a renvoyé
 * autre chose que la feuille de style attendue et la construction s'est
 * arrêtée — « An error occurred in next/font ». Le site n'était plus
 * constructible à cause d'un tiers. Provenance et licence des fichiers :
 * `LISEZ-MOI.txt`, à côté.
 *
 * Ce sont des fontes VARIABLES : un seul fichier par famille, et l'étendue
 * des graisses déclarée ici. Le navigateur produit le 500 et le 600 à partir
 * du même fichier — rien n'est perdu par rapport aux graisses nommées une à
 * une d'avant, et deux fichiers remplacent les sept qu'il aurait fallu.
 */
export const serif = fonteLocale({
  src: "./newsreader-latin.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--police-serif-chargee",
  display: "swap",
});

export const sans = fonteLocale({
  src: "./hanken-grotesk-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--police-sans-chargee",
  display: "swap",
});
