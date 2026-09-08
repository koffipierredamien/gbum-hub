import type { PersonneId, StructureId } from "../partage/identifiants.js";

/**
 * L'organisation du GBUM, telle que le mouvement la nomme.
 *
 * Le vocabulaire est en français parce que c'est celui du mouvement : le code
 * doit pouvoir être lu à voix haute devant le Secrétariat National.
 */
export type TypeStructure =
  | "mouvement"
  | "conseil_executif"
  | "secretariat_national"
  | "corps_amis"
  | "ville"
  | "cellule";

export interface Structure {
  readonly id: StructureId;
  readonly type: TypeStructure;
  readonly nom: string;
  readonly parentId: StructureId | null;
}

/**
 * Les rôles du mouvement.
 *
 * L'application actuelle n'en connaît que deux — « Responsable » et
 * « Membre » — dérivés d'un booléen : qui dirige au moins une structure est
 * responsable. Le responsable d'une cellule de Fès et le Secrétaire national
 * y portent donc la MÊME étiquette. C'est le terrain classique de l'IDOR.
 */
export type RoleGBUM =
  | "gbussien"
  | "responsable_cellule"
  | "membre_bureau"
  | "responsable_ville"
  | "conseiller_ville"
  | "membre_ce"
  | "permanent_sn"
  | "administrateur"
  | "ami"
  | "responsable_amis";

/**
 * La PORTÉE — ce qui manque au modèle actuel.
 *
 * Un rôle sans portée ne dit rien : « responsable » de quoi ? Toute
 * habilitation répond à la question, et le type interdit de l'oublier.
 */
export type Portee =
  | { readonly sur: "mouvement" }
  | { readonly sur: "structure"; readonly id: StructureId; readonly descendants: boolean }
  | { readonly sur: "soi" };

/**
 * Une habilitation EXPIRE.
 *
 * Un mandat qui se termine retire l'accès de lui-même. Aujourd'hui, un rôle
 * inscrit en base y reste jusqu'à ce que quelqu'un pense à l'enlever.
 */
export interface Habilitation {
  readonly role: RoleGBUM;
  readonly portee: Portee;
  readonly debut: Date;
  readonly fin: Date | null;
}

export interface Acteur {
  readonly personneId: PersonneId;
  readonly habilitations: readonly Habilitation[];
}

export const habilitationActive = (h: Habilitation, maintenant: Date): boolean =>
  h.debut.getTime() <= maintenant.getTime() &&
  (h.fin === null || h.fin.getTime() > maintenant.getTime());
