import { asc } from "drizzle-orm";
import { ouvrirBase } from "./connexion";
import { cellules, villes } from "./schema";

/**
 * S3 (ADR-012) — la seule porte vers PostgreSQL.
 *
 * Aucun autre paquet n'écrit de SQL, et aucun autre paquet n'importe
 * `drizzle`. Le jour où le moteur changerait, c'est ce dossier qui change, et
 * lui seul. Ce fichier rend des LIGNES, pas des objets du domaine : la
 * traduction vers le vocabulaire du GBUM appartient à l'appelant, qui décide
 * ensuite ce qui est publiable.
 */
export interface LigneVille {
  readonly id: string;
  readonly nom: string;
  readonly bureauCourriel: string | null;
  readonly bureauMandatDebut: Date | null;
  readonly bureauMandatFin: Date | null;
}

export interface LigneCellule {
  readonly id: string;
  readonly villeId: string;
  readonly nom: string;
  readonly nombreDeMembres: number | null;
}

export interface VillesEtCellules {
  readonly villes: readonly LigneVille[];
  readonly cellules: readonly LigneCellule[];
}

/**
 * Deux requêtes plutôt qu'une jointure : la jointure rendrait une ligne par
 * cellule, avec la ville répétée à chaque fois — et il faudrait la
 * déduplifier à la main. À cette échelle (quelques dizaines de lignes), deux
 * lectures simples et évidemment justes valent mieux qu'une lecture habile.
 */
export async function lireVillesEtCellules(): Promise<VillesEtCellules> {
  const { base, fermer } = ouvrirBase();
  try {
    const lignesVilles = await base
      .select({
        id: villes.id,
        nom: villes.nom,
        bureauCourriel: villes.bureauCourriel,
        bureauMandatDebut: villes.bureauMandatDebut,
        bureauMandatFin: villes.bureauMandatFin,
      })
      .from(villes)
      .orderBy(asc(villes.rang), asc(villes.nom));

    const lignesCellules = await base
      .select({
        id: cellules.id,
        villeId: cellules.villeId,
        nom: cellules.nom,
        nombreDeMembres: cellules.nombreDeMembres,
      })
      .from(cellules)
      .orderBy(asc(cellules.rang), asc(cellules.nom));

    return { villes: lignesVilles, cellules: lignesCellules };
  } finally {
    await fermer();
  }
}
