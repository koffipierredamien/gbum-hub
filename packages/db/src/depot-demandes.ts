import { ouvrirBase } from "./connexion";
import { demandes } from "./schema";

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
