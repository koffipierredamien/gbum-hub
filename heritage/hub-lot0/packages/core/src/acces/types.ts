import type { PersonneId, StructureId } from "../partage/identifiants.js";

export type Action = "lire" | "creer" | "modifier" | "valider" | "supprimer" | "exporter";

export type TypeRessource =
  | "fiche_personne"
  | "structure"
  | "canevas"
  | "seance"
  | "rapport"
  | "budget"
  | "camp"
  | "carnet_amis"
  | "suivi_jtpa";

export type EtatBudget = "brouillon" | "soumis" | "valide" | "clos";

/**
 * Toute ressource porte SA structure de rattachement.
 *
 * Ce n'est pas une commodité, c'est le mécanisme central : le type rend
 * impossible d'écrire une vérification qui oublie la portée. Une ressource
 * sans structure ne compile pas, donc `peut()` ne peut pas être appelé sans
 * l'information dont il a besoin pour cloisonner.
 */
export type Ressource =
  | { readonly type: "fiche_personne"; readonly structureId: StructureId; readonly personneId: PersonneId }
  | { readonly type: "structure"; readonly structureId: StructureId }
  | { readonly type: "canevas"; readonly structureId: StructureId; readonly publie: boolean }
  | { readonly type: "seance"; readonly structureId: StructureId }
  | { readonly type: "rapport"; readonly structureId: StructureId }
  | { readonly type: "budget"; readonly structureId: StructureId; readonly etat: EtatBudget }
  | { readonly type: "camp"; readonly structureId: StructureId }
  | { readonly type: "carnet_amis"; readonly structureId: StructureId }
  | {
      readonly type: "suivi_jtpa";
      readonly structureId: StructureId;
      readonly accompagnantId: PersonneId;
      readonly partageAuResponsable: boolean;
    };

/**
 * Un refus est MOTIVÉ, jamais un booléen nu : les journaux et les messages
 * d'erreur doivent pouvoir dire POURQUOI, sans que l'écran ait à le deviner.
 */
export type Motif =
  | "aucune_habilitation"
  | "habilitation_expiree"
  | "hors_perimetre"
  | "role_insuffisant"
  | "ressource_verrouillee"
  | "cloisonnement";

export type Decision =
  | { readonly autorise: true }
  | { readonly autorise: false; readonly motif: Motif };

export const OUI: Decision = { autorise: true };
export const non = (motif: Motif): Decision => ({ autorise: false, motif });
