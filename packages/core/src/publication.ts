/**
 * La règle du site public : **on s'arrête à la ville.**
 *
 * C'est ADR-011, et c'est la décision du mouvement du 9 septembre 2026 :
 *
 * > « Sur le site, nous n'irons pas jusqu'à mettre les informations des
 * > responsables de cellules. Nous nous arrêterons aux villes, mais nous
 * > indiquerons quand même les différentes cellules dans les villes. Nous
 * > garderons le contact du responsable de la ville, afin que des personnes
 * > puissent le contacter au besoin. »
 *
 * Ce fichier est l'endroit — le seul — où cette règle est écrite (R5). Elle
 * n'est pas appliquée par vigilance mais par le type (R3, P4) : `CellulePubliee`
 * ne peut pas porter un jour, un lieu ni un responsable, donc aucune page ne
 * peut les afficher, même par erreur. Ce qui n'existe pas ne fuit pas.
 */

import type { CelluleId, PersonneId, VilleId } from "./identifiants";
import type { Instant, Periode } from "./temps";
import { contient } from "./temps";

// --- Ce que le mouvement sait, à l'intérieur -------------------------------

export interface Cellule {
  readonly id: CelluleId;
  readonly nom: string;
  readonly nombreDeMembres: number;
  /** Jamais publié. */
  readonly jourDeRencontre: string;
  /** Jamais publié. */
  readonly lieu: string;
  /** Jamais publié. */
  readonly responsable: PersonneId;
}

/**
 * Le bureau d'une ville est renouvelé chaque année (cahier des charges §1).
 * Son mandat est donc daté — c'est le même mécanisme qu'ADR-005 : un droit est
 * une habilitation datée.
 */
export interface BureauDeVille {
  readonly courriel: string;
  readonly mandat: Periode;
}

export interface Ville {
  readonly id: VilleId;
  readonly nom: string;
  readonly cellules: readonly Cellule[];
  readonly bureau: BureauDeVille;
}

// --- Ce qu'un visiteur peut voir ------------------------------------------

/** Le nom et l'effectif. Rien d'autre n'est représentable. */
export interface CellulePubliee {
  readonly nom: string;
  readonly nombreDeMembres: number;
}

/**
 * Le contact du bureau, ou la raison de son absence — jamais un vide muet.
 * Un mandat échu n'est pas une panne : c'est septembre, et le nouveau bureau
 * n'est pas encore saisi. La page doit le dire, pas afficher un blanc.
 */
export type ContactPublie =
  | { readonly type: "disponible"; readonly courriel: string }
  | { readonly type: "mandat-echu" };

export interface VillePubliee {
  readonly nom: string;
  readonly nombreDeCellules: number;
  readonly cellules: readonly CellulePubliee[];
  readonly contact: ContactPublie;
}

// --- La règle -------------------------------------------------------------

export function publierCellule(cellule: Cellule): CellulePubliee {
  return { nom: cellule.nom, nombreDeMembres: cellule.nombreDeMembres };
}

export function publierContact(
  bureau: BureauDeVille,
  maintenant: Instant,
): ContactPublie {
  if (!contient(bureau.mandat, maintenant)) {
    return { type: "mandat-echu" };
  }
  return { type: "disponible", courriel: bureau.courriel };
}

export function publierVille(ville: Ville, maintenant: Instant): VillePubliee {
  return {
    nom: ville.nom,
    nombreDeCellules: ville.cellules.length,
    cellules: ville.cellules.map(publierCellule),
    contact: publierContact(ville.bureau, maintenant),
  };
}
