import type { StructureId } from "../partage/identifiants.js";
import type { Arbre } from "../organisation/arbre.js";
import { estDescendant } from "../organisation/arbre.js";
import type { Acteur, Habilitation, Portee, RoleGBUM } from "../organisation/types.js";
import { habilitationActive } from "../organisation/types.js";
import { DROITS } from "./droits.js";
import type { Action, Decision, Motif, Ressource } from "./types.js";
import { OUI, non } from "./types.js";

export interface Contexte {
  readonly arbre: Arbre;
  /** L'instant est INJECTÉ : une règle qui dépend de l'heure se teste sans attendre. */
  readonly maintenant: Date;
}

/** Les rôles qui voient le carnet des Amis — et eux seuls. */
const VOIENT_LES_AMIS: ReadonlySet<RoleGBUM> = new Set([
  "administrateur",
  "permanent_sn",
  "membre_ce",
  "responsable_amis",
]);

/** Un budget validé ne bouge plus : c'est un engagement, pas un brouillon. */
const BUDGET_FIGE = new Set(["valide", "clos"]);

function porteeCouvre(portee: Portee, cible: StructureId, arbre: Arbre): boolean {
  switch (portee.sur) {
    case "mouvement":
      return true;
    case "structure":
      return (
        portee.id === cible || (portee.descendants && estDescendant(arbre, cible, portee.id))
      );
    case "soi":
      return false; // traité à part : « soi » ne porte pas sur une structure
  }
}

/**
 * Ceux qui encadrent LOCALEMENT une structure.
 *
 * Volontairement sans le national : partager son suivi avec le responsable
 * de sa cellule ne doit pas l'ouvrir au Secrétariat National. « Son
 * responsable » veut dire le sien, pas toute la hiérarchie au-dessus.
 */
const ENCADRENT_LOCALEMENT: ReadonlySet<RoleGBUM> = new Set([
  "responsable_cellule",
  "membre_bureau",
  "responsable_ville",
  "conseiller_ville",
]);

/**
 * Le cloisonnement du JTPA — l'évangélisation par amitié.
 *
 * C'est la donnée la plus sensible que le mouvement puisse détenir : la
 * liste des personnes approchées, dans le contexte marocain, expose des
 * tiers qui ne sont pas membres et n'ont rien demandé.
 *
 * Cette fonction décide SEULE pour cette ressource — la table des droits ne
 * s'y applique pas, et aucun rôle n'y ouvre de porte : ni le Secrétariat
 * National ni l'administrateur ne lisent le suivi de quelqu'un d'autre, et
 * PERSONNE ne l'exporte ni ne le supprime.
 *
 * Une première version laissait la table des droits reprendre la main après
 * ce contrôle. Le suivi partagé devenait alors illisible par le responsable
 * à qui il était justement partagé — et, plus grave, la porte dépendait
 * d'une table qui n'a pas à connaître cette ressource. Le test l'a montré.
 */
function jtpa(
  acteur: Acteur,
  action: Action,
  ressource: Extract<Ressource, { type: "suivi_jtpa" }>,
  ctx: Contexte,
): Decision {
  if (ressource.accompagnantId === acteur.personneId) {
    // Son propre suivi lui appartient, SUPPRESSION COMPRISE : interdire
    // l'effacement rendrait une note sensible sur un tiers indestructible.
    // C'est la personne approchée que cela desservirait.
    // L'export reste fermé même à lui : il fabrique une copie hors des
    // protections du hub, et c'est là qu'est le risque réel.
    return action === "exporter" ? non("cloisonnement") : OUI;
  }
  if (action !== "lire" || !ressource.partageAuResponsable) return non("cloisonnement");

  // Partagé : seul un encadrant LOCAL dont la portée couvre la structure.
  // Une portée « mouvement » ne suffit pas — elle n'est pas un encadrement.
  const encadre = acteur.habilitations.some(
    (h) =>
      habilitationActive(h, ctx.maintenant) &&
      ENCADRENT_LOCALEMENT.has(h.role) &&
      h.portee.sur === "structure" &&
      porteeCouvre(h.portee, ressource.structureId, ctx.arbre),
  );
  return encadre ? OUI : non("cloisonnement");
}

/** Règles qui tiennent à l'ÉTAT de la ressource, pas au rôle du demandeur. */
function etatRessource(action: Action, ressource: Ressource): Decision {
  if (ressource.type === "budget" && BUDGET_FIGE.has(ressource.etat)) {
    if (action === "modifier" || action === "valider" || action === "supprimer") {
      return non("ressource_verrouillee");
    }
  }
  return OUI;
}

function habilitationPermet(
  h: Habilitation,
  action: Action,
  ressource: Ressource,
  ctx: Contexte,
): Decision {
  if (ressource.type === "carnet_amis" && !VOIENT_LES_AMIS.has(h.role)) {
    return non("role_insuffisant");
  }
  // Un canevas non publié est un brouillon d'auteur, pas encore le canevas
  // du mouvement : seuls ceux qui peuvent le modifier peuvent le lire.
  const actionsRole = DROITS[h.role][ressource.type];
  if (actionsRole === undefined || !actionsRole.includes(action)) {
    return non("role_insuffisant");
  }
  if (ressource.type === "canevas" && !ressource.publie && !actionsRole.includes("modifier")) {
    return non("role_insuffisant");
  }
  if (!porteeCouvre(h.portee, ressource.structureId, ctx.arbre)) {
    return non("hors_perimetre");
  }
  return OUI;
}

/** Le motif le plus informatif l'emporte quand plusieurs habilitations refusent. */
const RANG: Record<Motif, number> = {
  aucune_habilitation: 0,
  habilitation_expiree: 1,
  role_insuffisant: 2,
  hors_perimetre: 3,
  ressource_verrouillee: 4,
  cloisonnement: 5,
};

/** Chacun lit et corrige sa propre fiche, quelle que soit sa structure. */
function regleSoi(acteur: Acteur, action: Action, ressource: Ressource): boolean {
  return (
    ressource.type === "fiche_personne" &&
    ressource.personneId === acteur.personneId &&
    (action === "lire" || action === "modifier")
  );
}

/**
 * Une seule habilitation qui passe suffit ; sinon on rend le refus le plus
 * informatif rencontré, pour que le journal dise POURQUOI.
 */
function parLesHabilitations(
  acteur: Acteur,
  action: Action,
  ressource: Ressource,
  ctx: Contexte,
): Decision {
  if (acteur.habilitations.length === 0) return non("aucune_habilitation");

  let pire: Motif = "aucune_habilitation";
  for (const h of acteur.habilitations) {
    if (!habilitationActive(h, ctx.maintenant)) {
      if (RANG.habilitation_expiree > RANG[pire]) pire = "habilitation_expiree";
      continue;
    }
    const d = habilitationPermet(h, action, ressource, ctx);
    if (d.autorise) return OUI;
    if (RANG[d.motif] > RANG[pire]) pire = d.motif;
  }
  return non(pire);
}

/**
 * LE SEUL POINT DE DÉCISION DE TOUTE L'APPLICATION.
 *
 * Aucun écran, aucune route, aucun gabarit ne compare un rôle lui-même : ils
 * posent la question ici. La navigation elle-même en dérive — un écran
 * n'est pas caché par un `if` dans le gabarit, il est absent du menu PARCE
 * QUE cette fonction dit non. Une seule vérité, pas deux.
 *
 * Quatre régimes, dans cet ordre : le cloisonnement fort, l'état de la
 * ressource, ce qui appartient à la personne, puis ses habilitations.
 */
export function peut(
  acteur: Acteur,
  action: Action,
  ressource: Ressource,
  ctx: Contexte,
): Decision {
  // Le suivi JTPA sort du régime commun : sa fonction décide seule.
  if (ressource.type === "suivi_jtpa") return jtpa(acteur, action, ressource, ctx);

  const etat = etatRessource(action, ressource);
  if (!etat.autorise) return etat;

  if (regleSoi(acteur, action, ressource)) return OUI;

  return parLesHabilitations(acteur, action, ressource, ctx);
}
