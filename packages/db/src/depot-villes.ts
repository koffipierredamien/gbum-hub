import { asc, eq } from "drizzle-orm";
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

// --- L'écriture, depuis l'espace d'administration -------------------------

export async function creerVille(entree: {
  nom: string;
  rang: number;
}): Promise<string> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .insert(villes)
      .values({ nom: entree.nom, rang: entree.rang })
      .returning({ id: villes.id });
    if (ligne === undefined) throw new Error("la ville n'a pas été créée");
    return ligne.id;
  } finally {
    await fermer();
  }
}

export async function modifierVille(
  id: string,
  entree: {
    nom: string;
    rang: number;
    bureauCourriel: string | null;
    bureauMandatDebut: Date | null;
    bureauMandatFin: Date | null;
  },
): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base
      .update(villes)
      .set({ ...entree, modifieLe: new Date() })
      .where(eq(villes.id, id));
  } finally {
    await fermer();
  }
}

/** Les cellules d'une ville partent avec elle : c'est la cascade du schéma. */
export async function supprimerVille(id: string): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.delete(villes).where(eq(villes.id, id));
  } finally {
    await fermer();
  }
}

export async function creerCellule(entree: {
  villeId: string;
  nom: string;
  nombreDeMembres: number | null;
  rang: number;
}): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.insert(cellules).values(entree);
  } finally {
    await fermer();
  }
}

export async function modifierCellule(
  id: string,
  entree: { nom: string; nombreDeMembres: number | null; rang: number },
): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base
      .update(cellules)
      .set({ ...entree, modifieLe: new Date() })
      .where(eq(cellules.id, id));
  } finally {
    await fermer();
  }
}

export async function supprimerCellule(id: string): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.delete(cellules).where(eq(cellules.id, id));
  } finally {
    await fermer();
  }
}
