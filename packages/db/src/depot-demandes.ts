import { asc, count, desc, eq } from "drizzle-orm";
import { ouvrirBase } from "./connexion";
import { demandes, villes } from "./schema";

/**
 * L'écriture d'une demande reçue par un formulaire public.
 *
 * S3 — c'est ici, et nulle part ailleurs, qu'on écrit dans PostgreSQL.
 * La validation, elle, appartient à la frontière (R4) : ce dépôt reçoit des
 * données déjà sûres, et n'a pas à les re-vérifier.
 */
export interface NouvelleDemande {
  readonly sujet: string;
  readonly nom: string;
  readonly contact: string;
  readonly villeId: string | null;
  readonly villeLibre: string | null;
  readonly message: string;
}

export async function enregistrerDemande(demande: NouvelleDemande): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.insert(demandes).values({
      sujet: demande.sujet,
      nom: demande.nom,
      contact: demande.contact,
      villeId: demande.villeId,
      villeLibre: demande.villeLibre,
      message: demande.message,
    });
  } finally {
    await fermer();
  }
}

// --- La lecture, depuis l'espace d'administration -------------------------

export interface DemandeRecue {
  readonly id: string;
  readonly sujet: string;
  readonly nom: string;
  readonly contact: string;
  readonly villeNom: string | null;
  readonly villeLibre: string | null;
  readonly message: string;
  readonly traitee: boolean;
  readonly creeLe: Date;
}

/**
 * Les demandes reçues, les non traitées d'abord.
 *
 * Une boîte de réception qui n'affiche pas l'état de traitement se remplit et
 * n'est plus lue — c'est la raison d'être du compteur sur l'onglet.
 */
export async function lireDemandes(): Promise<readonly DemandeRecue[]> {
  const { base, fermer } = ouvrirBase();
  try {
    return await base
      .select({
        id: demandes.id,
        sujet: demandes.sujet,
        nom: demandes.nom,
        contact: demandes.contact,
        villeNom: villes.nom,
        villeLibre: demandes.villeLibre,
        message: demandes.message,
        traitee: demandes.traitee,
        creeLe: demandes.creeLe,
      })
      .from(demandes)
      .leftJoin(villes, eq(villes.id, demandes.villeId))
      .orderBy(asc(demandes.traitee), desc(demandes.creeLe));
  } finally {
    await fermer();
  }
}

export async function compterDemandesNonTraitees(): Promise<number> {
  const { base, fermer } = ouvrirBase();
  try {
    const [ligne] = await base
      .select({ combien: count() })
      .from(demandes)
      .where(eq(demandes.traitee, false));
    return ligne?.combien ?? 0;
  } finally {
    await fermer();
  }
}

export async function marquerDemande(id: string, traitee: boolean): Promise<void> {
  const { base, fermer } = ouvrirBase();
  try {
    await base.update(demandes).set({ traitee }).where(eq(demandes.id, id));
  } finally {
    await fermer();
  }
}
