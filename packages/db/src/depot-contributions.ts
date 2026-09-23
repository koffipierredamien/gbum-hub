import { desc } from "drizzle-orm";
import { ouvrirBase } from "./connexion";
import { contributions } from "./schema";

/**
 * Les réponses au formulaire de collecte. S3 — la seule porte vers PostgreSQL.
 */
export interface Contribution {
  readonly id: string;
  readonly champ: string;
  readonly valeur: string;
  readonly auteur: string;
  readonly contact: string | null;
  readonly creeLe: Date;
}

export async function enregistrerContributions(
  entrees: readonly {
    champ: string;
    valeur: string;
    auteur: string;
    contact: string | null;
  }[],
): Promise<void> {
  if (entrees.length === 0) return;

  const { base, fermer } = ouvrirBase();
  try {
    // Une seule insertion pour tout l'envoi : ou bien les réponses arrivent
    // ensemble, ou bien aucune n'arrive. Une moitié de formulaire enregistrée
    // serait pire qu'un formulaire perdu — on croirait avoir répondu.
    await base.insert(contributions).values([...entrees]);
  } finally {
    await fermer();
  }
}

export async function lireContributions(): Promise<readonly Contribution[]> {
  const { base, fermer } = ouvrirBase();
  try {
    return await base.select().from(contributions).orderBy(desc(contributions.creeLe));
  } finally {
    await fermer();
  }
}
