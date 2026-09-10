import "server-only";
import { lireVillesEtCellules } from "@gbum/db";
import {
  celluleId,
  echec,
  instant,
  personneId,
  publierVille,
  reussite,
  villeId,
  type Instant,
  type Resultat,
  type Ville,
  type VillePubliee,
} from "@gbum/core";

/**
 * La lecture des villes, et la seule.
 *
 * R2 — aucune erreur n'est avalée. Cette fonction ne rend jamais une liste
 * vide quand la base est injoignable : elle rend un échec typé, et c'est la
 * page qui décide quoi montrer. C'est exactement le défaut de l'application
 * actuelle, où « le filtre par ville de l'annuaire disparaissait en silence,
 * avalé par son try/except » — une base en panne et une ville sans cellule y
 * étaient indiscernables.
 */
export type ErreurLecture =
  | { readonly type: "base-injoignable"; readonly cause: unknown }
  | { readonly type: "base-non-configuree" };

/** L'instant zéro : la borne d'un mandat qu'on ne connaît pas. */
const JAMAIS = instant(0);

/**
 * La ville publiable, et son identifiant.
 *
 * `VillePubliee` ne porte volontairement PAS d'identifiant : sa liste de
 * champs est une garantie testée, et on n'y touche pas. Mais un formulaire a
 * besoin de savoir à quel bureau adresser un message. On rend donc la paire —
 * l'identifiant reste dehors, le contenu publiable reste intact.
 */
export interface VilleAvecId {
  readonly id: string;
  readonly ville: VillePubliee;
}

export async function lireVillesPubliees(
  maintenant: Instant,
): Promise<Resultat<readonly VilleAvecId[], ErreurLecture>> {
  if (process.env["DATABASE_URL"] === undefined) {
    return echec({ type: "base-non-configuree" });
  }

  try {
    const lignes = await lireVillesEtCellules();

    const villes: readonly Ville[] = lignes.villes.map((ligne) => ({
      id: villeId(ligne.id),
      nom: ligne.nom,
      cellules: lignes.cellules
        .filter((cellule) => cellule.villeId === ligne.id)
        .map((cellule) => ({
          id: celluleId(cellule.id),
          nom: cellule.nom,
          nombreDeMembres: cellule.nombreDeMembres ?? 0,
          // Ces trois champs n'existent PAS en base : ADR-011 est appliquée au
          // schéma lui-même. Le domaine les exige pour décrire une cellule
          // telle que le mouvement la connaît en interne, et `publierCellule`
          // ne les laisse pas sortir. Ils restent vides ici, et c'est correct.
          jourDeRencontre: "",
          lieu: "",
          responsable: personneId(""),
        })),
      bureau: {
        courriel: ligne.bureauCourriel ?? "",
        mandat: {
          debut: bornerMandat(ligne.bureauMandatDebut),
          fin: bornerMandat(ligne.bureauMandatFin),
        },
      },
    }));

    return reussite(
      villes.map((ville) => ({
        id: String(ville.id),
        ville: publierVille(ville, maintenant),
      })),
    );
  } catch (cause) {
    // On journalise avec le contexte, puis on remonte un échec typé. Ne rien
    // faire rendrait une panne, une faute de frappe et une base vide
    // indiscernables.
    console.error("lecture des villes publiées", { cause });
    return echec({ type: "base-injoignable", cause });
  }
}

/**
 * Un mandat dont une borne manque n'est PAS un mandat ouvert : c'est un mandat
 * qu'on ne connaît pas, et le contact reste alors non publié. Traiter
 * l'absence comme une autorisation serait exactement l'erreur qu'ADR-005 vise
 * — un droit est une habilitation datée, pas une habilitation par défaut.
 */
function bornerMandat(valeur: Date | null): Instant {
  return valeur === null ? JAMAIS : instant(valeur.getTime());
}
