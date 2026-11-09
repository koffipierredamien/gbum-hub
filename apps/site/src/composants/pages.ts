/**
 * L'ordre des pages, décidé le 9 septembre 2026 — RÉDUIT le 9 novembre 2026
 * pour la mobilisation en ville.
 *
 * Il suit le parcours du visiteur : qui nous sommes, où nous trouver, ce
 * qu'on y étudie, comment nous joindre. Quatre entrées, et rien de plus.
 *
 * Trois pages sont sorties du menu — « La vie du mouvement », « Agenda » et
 * « Soutenir ». Elles existent toujours et fonctionnent ; elles n'ont
 * simplement **rien à montrer** tant que le mouvement n'a pas fourni leurs
 * contenus. Un étudiant qu'on invite à découvrir le GBUM et qui ouvre trois
 * pages vides repart avec l'impression d'un mouvement vide. Elles reviendront
 * au menu le jour où elles auront quelque chose à dire : il suffit de
 * remettre leur ligne ici.
 *
 * « Rejoindre le GBUM » n'est PAS une entrée de menu : c'est l'action, et
 * l'unique bouton ambre.
 */
export const MENU = [
  { chemin: "/le-mouvement", cle: "leMouvement" },
  { chemin: "/ou-nous-sommes", cle: "ouNousSommes" },
  { chemin: "/le-canevas", cle: "leCanevas" },
  { chemin: "/nous-ecrire", cle: "nousEcrire" },
] as const;

/**
 * Le pied de page reprend le même ordre, en deux colonnes.
 *
 * Il ne renvoie pas non plus vers les pages sorties du menu : un pied de page
 * qui mène à des pages vides est un menu caché, pas une discrétion.
 */
export const PIED = [
  {
    cle: "decouvrir",
    liens: [
      { chemin: "/le-mouvement", cle: "leMouvement" },
      { chemin: "/ou-nous-sommes", cle: "ouNousSommes" },
      { chemin: "/le-canevas", cle: "leCanevas" },
    ],
  },
  {
    cle: "participer",
    liens: [
      { chemin: "/rejoindre", cle: "rejoindre" },
      { chemin: "/nous-ecrire", cle: "nousEcrire" },
    ],
  },
] as const;
