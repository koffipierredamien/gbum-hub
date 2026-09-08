import type { RoleGBUM } from "../organisation/types.js";
import type { Action, TypeRessource } from "./types.js";

/**
 * Ce que chaque rôle peut faire — DANS LA PORTÉE de son habilitation.
 *
 * Cette table est le seul endroit de l'application où un rôle est comparé à
 * une action. L'application actuelle éparpille la même question entre
 * `login_required`, `admin_required`, `role_required`, `est_admin()`,
 * `_est_national()`, `_voit_amis()`, `_place_amis()` et des conditions dans
 * les gabarits — et son propre code en tire la leçon : « deux règles
 * recopiées finissent toujours par diverger, et c'est alors une porte de
 * trop ».
 *
 * La portée n'est PAS ici : elle est portée par l'habilitation. Un
 * responsable de cellule et un permanent du Secrétariat National peuvent
 * lire un rapport ; ce qui les distingue est l'étendue sur laquelle ils le
 * peuvent.
 */
type Table = Readonly<Partial<Record<TypeRessource, readonly Action[]>>>;

const LECTURE_TERRAIN: Table = {
  structure: ["lire"],
  fiche_personne: ["lire"],
  canevas: ["lire"],
  seance: ["lire"],
  rapport: ["lire"],
  camp: ["lire"],
};

export const DROITS: Readonly<Record<RoleGBUM, Table>> = {
  // L'étudiant : il lit la vie de sa cellule, il n'administre rien.
  gbussien: {
    structure: ["lire"],
    fiche_personne: ["lire"],
    canevas: ["lire"],
    seance: ["lire"],
  },

  // Il anime l'étude et rend compte. Le rapport mensuel est SON geste.
  responsable_cellule: {
    ...LECTURE_TERRAIN,
    seance: ["lire", "creer", "modifier"],
    rapport: ["lire", "creer", "modifier"],
    budget: ["lire", "creer", "modifier"],
  },

  membre_bureau: {
    ...LECTURE_TERRAIN,
    structure: ["lire", "creer", "modifier"],
    seance: ["lire", "creer", "modifier"],
    rapport: ["lire", "creer", "modifier"],
    budget: ["lire", "creer", "modifier"],
    camp: ["lire", "creer", "modifier"],
    fiche_personne: ["lire", "creer", "modifier"],
  },

  responsable_ville: {
    ...LECTURE_TERRAIN,
    structure: ["lire", "creer", "modifier"],
    seance: ["lire", "creer", "modifier"],
    rapport: ["lire", "creer", "modifier"],
    budget: ["lire", "creer", "modifier", "valider"],
    camp: ["lire", "creer", "modifier"],
    fiche_personne: ["lire", "creer", "modifier"],
  },

  // Le conseiller ACCOMPAGNE : il voit tout de sa ville, il n'écrit rien.
  // C'est un adulte extérieur au mouvement étudiant, et le mouvement reste
  // animé par des étudiants.
  conseiller_ville: { ...LECTURE_TERRAIN, budget: ["lire"] },

  membre_ce: {
    ...LECTURE_TERRAIN,
    budget: ["lire", "valider"],
    carnet_amis: ["lire"],
    fiche_personne: ["lire", "exporter"],
    rapport: ["lire", "exporter"],
  },

  // Le Secrétariat National tient le canevas de l'année : c'est lui qui
  // l'écrit, le relit et le publie.
  permanent_sn: {
    ...LECTURE_TERRAIN,
    structure: ["lire", "creer", "modifier"],
    canevas: ["lire", "creer", "modifier", "valider"],
    seance: ["lire", "creer", "modifier"],
    rapport: ["lire", "creer", "modifier", "exporter"],
    budget: ["lire", "creer", "modifier", "valider"],
    camp: ["lire", "creer", "modifier"],
    carnet_amis: ["lire"],
    fiche_personne: ["lire", "creer", "modifier", "exporter"],
  },

  administrateur: {
    structure: ["lire", "creer", "modifier", "supprimer"],
    fiche_personne: ["lire", "creer", "modifier", "supprimer", "exporter"],
    canevas: ["lire", "creer", "modifier", "valider", "supprimer"],
    seance: ["lire", "creer", "modifier", "supprimer"],
    rapport: ["lire", "creer", "modifier", "supprimer", "exporter"],
    budget: ["lire", "creer", "modifier", "valider", "supprimer"],
    camp: ["lire", "creer", "modifier", "supprimer"],
    carnet_amis: ["lire", "modifier", "exporter"],
  },

  // Les Amis sont un corps du mouvement, pas une étiquette : ils voient leur
  // corps, pas les étudiants.
  ami: { structure: ["lire"], fiche_personne: ["lire"] },

  responsable_amis: {
    structure: ["lire"],
    fiche_personne: ["lire", "modifier"],
    carnet_amis: ["lire", "modifier", "exporter"],
  },
};
