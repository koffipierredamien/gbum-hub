import { eq, inArray, notInArray } from "drizzle-orm";
import { ouvrirBase } from "./connexion";
import { cellules, villes } from "./schema";

/**
 * Le miroir des villes et cellules du hub privé (ADR-014, C1).
 *
 * Le hub privé en est le propriétaire ; cette base n'en garde qu'une copie,
 * pour que le site continue de s'afficher si le hub est injoignable (C6). La
 * copie est remplacée d'un bloc, dans une transaction : un visiteur ne voit
 * jamais une moitié d'ancienne liste et une moitié de nouvelle.
 *
 * Ce qui n'appartient qu'au site est gardé : l'identifiant de chaque ville
 * (les demandes reçues y sont rattachées) et le contact de son bureau, que le
 * hub privé ne publie pas dans la version 1. Une ville reconnue par son NOM
 * garde les deux. Une ville que le hub ne publie plus disparaît du site : elle
 * a cessé d'être publique, et ADR-011 veut que ce retrait soit immédiat.
 */
export interface VilleDuHub {
  readonly nom: string;
  readonly rang: number;
  readonly cellules: readonly {
    readonly nom: string;
    readonly nombreDeMembres: number | null;
  }[];
}

export interface BilanDuMiroir {
  readonly villes: number;
  readonly cellules: number;
  readonly retirees: number;
}

type Base = ReturnType<typeof ouvrirBase>["base"];
type Transaction = Parameters<Parameters<Base["transaction"]>[0]>[0];

export async function remplacerParLeHub(
  publiees: readonly VilleDuHub[],
): Promise<BilanDuMiroir> {
  const { base, fermer } = ouvrirBase();
  try {
    return await base.transaction(async (tx) => {
      const retirees = await retirerLesAutres(tx, publiees);
      const ids = await garderOuCreer(tx, publiees);
      const cellulesPosees = await remplacerLesCellules(tx, publiees, ids);
      return { villes: ids.length, cellules: cellulesPosees, retirees };
    });
  } finally {
    await fermer();
  }
}

/** Les villes que le hub ne publie plus quittent le site (ADR-011). */
async function retirerLesAutres(
  tx: Transaction,
  publiees: readonly VilleDuHub[],
): Promise<number> {
  const noms = publiees.map((v) => v.nom);
  const retirees = await tx
    .delete(villes)
    .where(noms.length > 0 ? notInArray(villes.nom, noms) : undefined)
    .returning({ id: villes.id });
  return retirees.length;
}

/**
 * Une ville reconnue par son nom garde son identifiant et son contact ; une
 * ville nouvelle est créée. Rend les identifiants dans l'ordre de `publiees`.
 */
async function garderOuCreer(
  tx: Transaction,
  publiees: readonly VilleDuHub[],
): Promise<readonly string[]> {
  const lignes = await tx.select({ id: villes.id, nom: villes.nom }).from(villes);
  const existantes = new Map(lignes.map((l) => [l.nom, l.id]));
  const ids: string[] = [];
  for (const ville of publiees) {
    const id = existantes.get(ville.nom);
    if (id === undefined) {
      const [neuve] = await tx
        .insert(villes)
        .values({ nom: ville.nom, rang: ville.rang })
        .returning({ id: villes.id });
      if (neuve === undefined) throw new Error(`ville non créée : ${ville.nom}`);
      ids.push(neuve.id);
    } else {
      await tx
        .update(villes)
        .set({ rang: ville.rang, modifieLe: new Date() })
        .where(eq(villes.id, id));
      ids.push(id);
    }
  }
  return ids;
}

async function remplacerLesCellules(
  tx: Transaction,
  publiees: readonly VilleDuHub[],
  ids: readonly string[],
): Promise<number> {
  if (ids.length > 0)
    await tx.delete(cellules).where(inArray(cellules.villeId, [...ids]));
  const lignes = publiees.flatMap((ville, i) =>
    ville.cellules.map((cellule, rang) => ({
      villeId: ids[i] ?? "",
      nom: cellule.nom,
      nombreDeMembres: cellule.nombreDeMembres,
      rang,
    })),
  );
  if (lignes.length > 0) await tx.insert(cellules).values(lignes);
  return lignes.length;
}
