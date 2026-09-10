/**
 * L'ordre des pages, décidé le 9 septembre 2026.
 *
 * Il suit le parcours du visiteur, pas l'organigramme du mouvement :
 * découvrir (qui, où, la preuve), participer (ce qui vient), approfondir
 * (le canevas), s'engager (soutenir, écrire).
 *
 * « Rejoindre le GBUM » n'est PAS une entrée de menu : c'est l'action, et
 * l'unique bouton ambre. Un menu à huit entrées dont l'une est un verbe n'a
 * plus de hiérarchie.
 */
export const MENU = [
  { chemin: "/le-mouvement", cle: "leMouvement" },
  { chemin: "/ou-nous-sommes", cle: "ouNousSommes" },
  { chemin: "/la-vie-du-mouvement", cle: "laVieDuMouvement" },
  { chemin: "/agenda", cle: "agenda" },
  { chemin: "/le-canevas", cle: "leCanevas" },
  { chemin: "/soutenir", cle: "soutenir" },
  { chemin: "/nous-ecrire", cle: "nousEcrire" },
] as const;

/** Le pied de page reprend le même ordre, en trois colonnes. */
export const PIED = [
  {
    cle: "decouvrir",
    liens: [
      { chemin: "/le-mouvement", cle: "leMouvement" },
      { chemin: "/ou-nous-sommes", cle: "ouNousSommes" },
      { chemin: "/la-vie-du-mouvement", cle: "laVieDuMouvement" },
    ],
  },
  {
    cle: "participer",
    liens: [
      { chemin: "/agenda", cle: "agenda" },
      { chemin: "/le-canevas", cle: "leCanevas" },
      { chemin: "/rejoindre", cle: "rejoindre" },
    ],
  },
  {
    cle: "soutenir",
    liens: [
      { chemin: "/soutenir", cle: "priere" },
      { chemin: "/soutenir", cle: "don" },
      { chemin: "/soutenir", cle: "amis" },
    ],
  },
] as const;
