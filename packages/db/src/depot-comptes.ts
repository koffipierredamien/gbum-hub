import { and, asc, count, eq, gt, lt } from "drizzle-orm";
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

/** Combien de comptes existent — pour savoir s'il faut créer le premier. */
export async function compterComptes(): Promise<number> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base.select({ combien: count() }).from(comptes);
    return ligne?.combien ?? 0;
  } finally {
    await fermer();
  }
}

/** Le compte tel que l'écran des comptes l'affiche — jamais le condensat. */
export interface CompteDetaille extends Compte {
  readonly actif: boolean;
  readonly creeLe: Date;
  readonly derniereConnexion: Date | null;
}

export async function listerComptes(): Promise<readonly CompteDetaille[]> {
  const { base, fermer } = ouvrirBase();
  try {
    return await base
      .select({
        id: comptes.id,
        courriel: comptes.courriel,
        nom: comptes.nom,
        role: comptes.role,
        actif: comptes.actif,
        creeLe: comptes.creeLe,
        derniereConnexion: comptes.derniereConnexion,
      })
      .from(comptes)
      .orderBy(asc(comptes.creeLe));
  } finally {
    await fermer();
  }
}

/** Rend aussi le condensat : c'est l'appelant qui vérifie, pas ce dépôt. */
export async function lireCompteParId(
  id: string,
): Promise<(Compte & { readonly motDePasse: string; readonly actif: boolean }) | null> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .select()
      .from(comptes)
      .where(eq(comptes.id, id))
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

/**
 * Combien de comptes techniques sont encore actifs.
 *
 * Sert à l'invariant du domaine : il en reste toujours au moins un. La
 * DÉCISION est dans `@gbum/core` ; ce dépôt ne fait que compter.
 */
export async function compterTechniquesActifs(): Promise<number> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .select({ combien: count() })
      .from(comptes)
      .where(and(eq(comptes.role, "technique"), eq(comptes.actif, true)));
    return ligne?.combien ?? 0;
  } finally {
    await fermer();
  }
}

/**
 * Change le mot de passe ET ferme toutes les sessions du compte.
 *
 * Les deux gestes ne se séparent pas : changer son mot de passe parce qu'on
 * le croit connu, tout en laissant ouvertes les sessions déjà volées, ne
 * protège de rien. L'écran rouvre ensuite une session pour le navigateur qui
 * vient de faire la demande — les autres doivent se reconnecter.
 */
export async function definirMotDePasse(
  compteId: string,
  motDePasseHache: string,
): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base
      .update(comptes)
      .set({ motDePasse: motDePasseHache })
      .where(eq(comptes.id, compteId));
    await base.delete(sessions).where(eq(sessions.compteId, compteId));
  } finally {
    await fermer();
  }
}

/**
 * Active ou désactive un compte. Une désactivation ferme aussi ses sessions :
 * sans cela, la personne resterait connectée jusqu'à trente jours après le
 * retrait de son accès.
 */
export async function definirActivite(compteId: string, actif: boolean): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.update(comptes).set({ actif }).where(eq(comptes.id, compteId));
    if (!actif) await base.delete(sessions).where(eq(sessions.compteId, compteId));
  } finally {
    await fermer();
  }
}
