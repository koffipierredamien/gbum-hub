/**
 * Le canevas d'études bibliques de l'année.
 *
 * Saisi depuis le document officiel du Secrétariat National — « La communion
 * fraternelle des disciples », canevas 2026-2027, équipe de rédaction conduite
 * par le Dr Pierre ADIMI. Rien n'est résumé ni reformulé : les titres sont
 * ceux du document.
 *
 * Il vit dans le code et non en base parce qu'il change une fois par an, et
 * qu'un canevas est un texte arrêté : il ne se modifie pas en cours d'année
 * depuis un écran d'administration.
 */
export interface PartieDuCanevas {
  readonly nom: string;
  readonly etudes: readonly string[];
}

export interface Canevas {
  readonly annee: string;
  readonly titre: string;
  readonly reference: string;
  readonly presentation: string;
  readonly document: string;
  readonly parties: readonly PartieDuCanevas[];
}

export const CANEVAS: Canevas = {
  annee: "2026 — 2027",
  titre: "La communion fraternelle des disciples",
  reference: "Actes 2.42",
  presentation:
    "Quatrième année de la vision décennale. La communion fraternelle est " +
    "d'abord un don reçu : c'est parce que Dieu nous a appelés à la communion " +
    "avec Son Fils, par Son Esprit, que nous pouvons ensuite être en communion " +
    "les uns avec les autres. Elle n'est donc jamais une simple sympathie " +
    "humaine ou une question d'affinités, mais le fruit d'une même vie reçue " +
    "de Dieu — un appel à la vivre concrètement dans un monde universitaire " +
    "souvent marqué par l'individualisme, la compétition et l'isolement.",
  document: "/documents/canevas-gbum-2026-2027.pdf",
  parties: [
    {
      nom: "Partie introductive — Naître, croître et s'affermir",
      etudes: ["La nouvelle naissance spirituelle", "La nouvelle vie en Christ"],
    },
    {
      nom: "Partie A — Une communion qui vient d'en haut",
      etudes: [
        "La communion avec le Père et le Fils",
        "La communion par le Saint-Esprit",
        "La communion dans la souffrance et la force du Christ",
        "La communion autour du repas du Seigneur",
      ],
    },
    {
      nom: "Partie B — Une communion qui se vit entre nous",
      etudes: [
        "La vie ensemble des premiers chrétiens",
        "Le partage des biens entre croyants",
        "Un seul corps, plusieurs membres",
        "L'unité malgré les différences",
      ],
    },
    {
      nom: "Partie C — Les ennemis de la communion fraternelle",
      etudes: [
        "Quand la jalousie sépare des frères",
        "Quand l'orgueil divise une communauté",
        "Quand une offense n'est pas réglée",
        "Quand chacun ne pense qu'à lui",
      ],
    },
    {
      nom: "Partie D — Garder la communion fraternelle",
      etudes: [
        "S'entraider les uns les autres",
        "Aimer en actes et en vérité",
        "Se confesser et se restaurer mutuellement",
        "Persévérer ensemble malgré les tensions",
      ],
    },
    {
      nom: "Partie E — La communion qui prépare l'avenir",
      etudes: [
        "La communion comme témoignage devant le monde",
        "Transmettre ce que nous avons reçu",
        "Préparer la relève avant de partir",
        "La communion parfaite qui nous attend",
      ],
    },
  ],
};

export function nombreDEtudes(canevas: Canevas): number {
  return canevas.parties.reduce((total, partie) => total + partie.etudes.length, 0);
}
