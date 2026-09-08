import { describe, expect, it } from "vitest";
import { DROITS, peut } from "../src/index.js";
import type { Action, Portee, Ressource, RoleGBUM, TypeRessource } from "../src/index.js";
import { CTX, P, S, acteur, habilitation, surCellule, surEtSous, surLeMouvement } from "./fixtures.js";

/**
 * L'audit IDOR, en continu.
 *
 * Le dépôt actuel contient un `tests/audit_idor.py` — la preuve que le risque
 * est connu. Mais il se lance à la main, en SSH, APRÈS la livraison. Ici
 * l'invariant est énuméré à chaque pull request : aucune combinaison de rôle,
 * de portée, d'action et de ressource ne doit ouvrir un accès hors périmètre.
 */

const ROLES = Object.keys(DROITS) as readonly RoleGBUM[];
const ACTIONS: readonly Action[] = ["lire", "creer", "modifier", "valider", "supprimer", "exporter"];

/** Toutes les ressources sont dans Rabat-Agdal, et appartiennent à QUELQU'UN D'AUTRE. */
const RESSOURCES: Readonly<Record<TypeRessource, Ressource>> = {
  fiche_personne: { type: "fiche_personne", structureId: S.agdal, personneId: P.amina },
  structure: { type: "structure", structureId: S.agdal },
  canevas: { type: "canevas", structureId: S.agdal, publie: true },
  seance: { type: "seance", structureId: S.agdal },
  rapport: { type: "rapport", structureId: S.agdal },
  budget: { type: "budget", structureId: S.agdal, etat: "brouillon" },
  camp: { type: "camp", structureId: S.agdal },
  carnet_amis: { type: "carnet_amis", structureId: S.agdal },
  suivi_jtpa: {
    type: "suivi_jtpa",
    structureId: S.agdal,
    accompagnantId: P.amina,
    partageAuResponsable: false,
  },
};

const HORS_PERIMETRE: ReadonlyArray<readonly [string, Portee]> = [
  ["la cellule d'à côté", surCellule(S.souissi)],
  ["une autre ville, descendants compris", surEtSous(S.fes)],
  ["une cellule d'une autre ville", surCellule(S.dharElMahraz)],
  ["le corps des Amis", surCellule(S.corpsAmis)],
];

const DANS_LE_PERIMETRE: ReadonlyArray<readonly [string, Portee]> = [
  ["le mouvement entier", surLeMouvement],
  ["la cellule elle-même", surCellule(S.agdal)],
  ["la ville et ses cellules", surEtSous(S.rabat)],
];

describe("invariant : une portée qui ne couvre pas la ressource n'autorise jamais", () => {
  for (const [nomPortee, portee] of HORS_PERIMETRE) {
    it(`aucun rôle n'agit depuis ${nomPortee}`, () => {
      const fuites: string[] = [];
      for (const role of ROLES) {
        const a = acteur(P.yann, habilitation(role, portee));
        for (const action of ACTIONS) {
          for (const [nom, ressource] of Object.entries(RESSOURCES)) {
            if (peut(a, action, ressource, CTX).autorise) {
              fuites.push(`${role} peut ${action} ${nom}`);
            }
          }
        }
      }
      expect(fuites).toEqual([]);
    });
  }

  it("couvre bien toutes les combinaisons", () => {
    const total = HORS_PERIMETRE.length * ROLES.length * ACTIONS.length
      * Object.keys(RESSOURCES).length;
    expect(total).toBe(4 * 10 * 6 * 9);
  });
});

describe("invariant : une habilitation inactive ne donne rien", () => {
  it("expirée ou pas encore commencée, quelle que soit la portée", () => {
    const fuites: string[] = [];
    const inactives = [
      { fin: new Date("2026-01-01T00:00:00Z") },
      { debut: new Date("2027-01-01T00:00:00Z") },
    ] as const;
    for (const opts of inactives) {
      for (const role of ROLES) {
        const a = acteur(P.yann, habilitation(role, surLeMouvement, opts));
        for (const action of ACTIONS) {
          for (const [nom, ressource] of Object.entries(RESSOURCES)) {
            if (peut(a, action, ressource, CTX).autorise) fuites.push(`${role}/${action}/${nom}`);
          }
        }
      }
    }
    expect(fuites).toEqual([]);
  });
});

describe("invariant : le GBUssien n'écrit nulle part", () => {
  it("aucune action d'écriture, même dans sa propre cellule", () => {
    const ecritures: readonly Action[] = ["creer", "modifier", "valider", "supprimer", "exporter"];
    const fuites: string[] = [];
    for (const [, portee] of DANS_LE_PERIMETRE) {
      const a = acteur(P.yann, habilitation("gbussien", portee));
      for (const action of ecritures) {
        for (const [nom, ressource] of Object.entries(RESSOURCES)) {
          if (peut(a, action, ressource, CTX).autorise) fuites.push(`${action} ${nom}`);
        }
      }
    }
    expect(fuites).toEqual([]);
  });
});

describe("invariant : le suivi JTPA d'autrui ne sort jamais", () => {
  it("aucun rôle, aucune portée, ne l'exporte ni ne le supprime", () => {
    const fuites: string[] = [];
    for (const [, portee] of [...DANS_LE_PERIMETRE, ...HORS_PERIMETRE]) {
      for (const role of ROLES) {
        const a = acteur(P.yann, habilitation(role, portee));
        for (const action of ["exporter", "supprimer"] as const) {
          if (peut(a, action, RESSOURCES.suivi_jtpa, CTX).autorise) {
            fuites.push(`${role} ${action} depuis ${portee.sur}`);
          }
        }
      }
    }
    expect(fuites).toEqual([]);
  });
});

describe("contre-épreuve : la politique n'est pas bloquante par accident", () => {
  it("un test qui refuse tout passerait les invariants — vérifions qu'elle autorise", () => {
    const sn = acteur(P.sarah, habilitation("permanent_sn", surLeMouvement));
    expect(peut(sn, "lire", RESSOURCES.rapport, CTX).autorise).toBe(true);
    const resp = acteur(P.yann, habilitation("responsable_cellule", surCellule(S.agdal)));
    expect(peut(resp, "creer", RESSOURCES.seance, CTX).autorise).toBe(true);
  });
});
