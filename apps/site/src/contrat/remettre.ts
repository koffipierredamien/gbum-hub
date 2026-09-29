import "server-only";
import { lireDemandesARemettre, marquerRemise } from "@gbum/db";
import { remettreDemande, SUJETS, type Demande } from "@gbum/contrat";
import { hubPrive } from "./hub";

export interface BilanDeRemise {
  readonly remises: number;
  readonly enAttente: number;
}

/**
 * Remet au hub privé les demandes qu'il n'a pas encore reçues (ADR-014, C6).
 *
 * Appelée après chaque nouvelle demande, et depuis l'administration. Une
 * demande n'est marquée remise qu'après l'accusé de réception du hub ; au
 * premier échec on s'arrête — inutile d'insister sur un serveur qui ne
 * répond pas — et tout ce qui reste repartira la fois suivante.
 */
export async function remettreLesDemandes(): Promise<BilanDeRemise> {
  const hub = hubPrive();
  const aRemettre = await lireDemandesARemettre();
  if (hub === null) return { remises: 0, enAttente: aRemettre.length };

  let remises = 0;
  for (const ligne of aRemettre) {
    const resultat = await remettreDemande(hub, versLeContrat(ligne));
    if (!resultat.ok) {
      console.error("remise d'une demande au hub privé", {
        demande: ligne.id,
        erreur: resultat.erreur,
      });
      break;
    }
    await marquerRemise(ligne.id, new Date());
    remises += 1;
  }
  return { remises, enAttente: aRemettre.length - remises };
}

function versLeContrat(ligne: {
  readonly id: string;
  readonly sujet: string;
  readonly nom: string;
  readonly contact: string;
  readonly villeNom: string | null;
  readonly villeLibre: string | null;
  readonly message: string;
  readonly creeLe: Date;
}): Demande {
  // Le sujet a été validé à l'entrée par la même liste ; une ligne plus
  // ancienne qui porterait autre chose part en « autre » plutôt que d'être
  // refusée par le hub et de bloquer toute la file derrière elle.
  const sujet = SUJETS.find((s) => s === ligne.sujet) ?? "autre";
  return {
    version: "1",
    id: ligne.id,
    creeLe: ligne.creeLe.toISOString().replace(/\.\d{3}Z$/, "Z"),
    sujet,
    nom: ligne.nom,
    contact: ligne.contact,
    ville: ligne.villeNom,
    villeLibre: ligne.villeLibre,
    message: ligne.message,
  };
}
