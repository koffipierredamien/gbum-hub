import { and, eq, gt, lt } from "drizzle-orm";
import { ouvrirBase } from "./connexion";
import { comptes, sessions } from "./schema";

/**
 * Les comptes et les sessions de l'espace d'administration.
 *
 * S3 — la seule porte vers PostgreSQL. Le hachage, lui, appartient à
 * `@gbum/identite` : ce dépôt range et relit, il ne décide de rien.
 */

export interface Compte {
  readonly id: string;
  readonly courriel: string;
  readonly nom: string;
  readonly role: string;
}

export async function creerCompte(entree: {
  courriel: string;
  nom: string;
  motDePasseHache: string;
  role: string;
}): Promise<Compte> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .insert(comptes)
      .values({
        courriel: entree.courriel.trim().toLowerCase(),
        nom: entree.nom.trim(),
        motDePasse: entree.motDePasseHache,
        role: entree.role,
      })
      .returning({
        id: comptes.id,
        courriel: comptes.courriel,
        nom: comptes.nom,
        role: comptes.role,
      });
    if (ligne === undefined) throw new Error("le compte n'a pas été créé");
    return ligne;
  } finally {
    await fermer();
  }
}

/** Rend aussi le condensat : c'est l'appelant qui vérifie, pas ce dépôt. */
export async function lireCompteParCourriel(
  courriel: string,
): Promise<(Compte & { readonly motDePasse: string; readonly actif: boolean }) | null> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .select()
      .from(comptes)
      .where(eq(comptes.courriel, courriel.trim().toLowerCase()))
      .limit(1);
    if (ligne === undefined) return null;
    return {
      id: ligne.id,
      courriel: ligne.courriel,
      nom: ligne.nom,
      role: ligne.role,
      motDePasse: ligne.motDePasse,
      actif: ligne.actif,
    };
  } finally {
    await fermer();
  }
}

export async function ouvrirSession(entree: {
  empreinte: string;
  compteId: string;
  expireLe: Date;
}): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.insert(sessions).values(entree);
    await base
      .update(comptes)
      .set({ derniereConnexion: new Date() })
      .where(eq(comptes.id, entree.compteId));
  } finally {
    await fermer();
  }
}

/**
 * Une session expirée n'est PAS une session : la condition d'expiration est
 * dans la requête, pas dans le code appelant. Une vérification qu'on peut
 * oublier d'écrire finit par être oubliée.
 */
export async function lireSession(
  empreinte: string,
  maintenant: Date,
): Promise<Compte | null> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .select({
        id: comptes.id,
        courriel: comptes.courriel,
        nom: comptes.nom,
        role: comptes.role,
        actif: comptes.actif,
      })
      .from(sessions)
      .innerJoin(comptes, eq(comptes.id, sessions.compteId))
      .where(and(eq(sessions.empreinte, empreinte), gt(sessions.expireLe, maintenant)))
      .limit(1);
    if (ligne === undefined || !ligne.actif) return null;
    return { id: ligne.id, courriel: ligne.courriel, nom: ligne.nom, role: ligne.role };
  } finally {
    await fermer();
  }
}

export async function fermerSession(empreinte: string): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.delete(sessions).where(eq(sessions.empreinte, empreinte));
  } finally {
    await fermer();
  }
}

/** Les sessions échues ne servent plus qu'à grossir la table. */
export async function purgerSessionsEchues(maintenant: Date): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.delete(sessions).where(lt(sessions.expireLe, maintenant));
  } finally {
    await fermer();
  }
}
