import { arbreDepuis, personneId, structureId } from "../src/index.js";
import type { Acteur, Habilitation, Portee, RoleGBUM, Structure } from "../src/index.js";

export const S = {
  mouvement: structureId(1),
  conseilExecutif: structureId(2),
  secretariatNational: structureId(3),
  corpsAmis: structureId(4),
  rabat: structureId(10),
  agdal: structureId(11),
  souissi: structureId(12),
  fes: structureId(20),
  dharElMahraz: structureId(21),
} as const;

const s = (id: number, type: Structure["type"], nom: string, parent: number | null): Structure => ({
  id: structureId(id),
  type,
  nom,
  parentId: parent === null ? null : structureId(parent),
});

export const STRUCTURES: readonly Structure[] = [
  s(1, "mouvement", "GBU Maroc", null),
  s(2, "conseil_executif", "Conseil Exécutif", 1),
  s(3, "secretariat_national", "Secrétariat National", 1),
  s(4, "corps_amis", "Amis du GBU", 1),
  s(10, "ville", "Rabat", 1),
  s(11, "cellule", "Rabat-Agdal", 10),
  s(12, "cellule", "Rabat-Souissi", 10),
  s(20, "ville", "Fès", 1),
  s(21, "cellule", "Dhar El Mahraz", 20),
];

export const ARBRE = arbreDepuis(STRUCTURES);
export const MAINTENANT = new Date("2026-03-16T09:00:00Z");
export const CTX = { arbre: ARBRE, maintenant: MAINTENANT };

export const P = {
  yann: personneId(100), // responsable de la cellule de Rabat-Agdal
  amina: personneId(101), // GBUssienne de Rabat-Agdal
  sarah: personneId(102), // Secrétariat National
  ismail: personneId(103), // responsable à Fès
} as const;

export function habilitation(
  role: RoleGBUM,
  portee: Portee,
  opts: { readonly debut?: Date; readonly fin?: Date | null } = {},
): Habilitation {
  return {
    role,
    portee,
    debut: opts.debut ?? new Date("2025-09-01T00:00:00Z"),
    fin: opts.fin ?? null,
  };
}

export function acteur(id: (typeof P)[keyof typeof P], ...hs: Habilitation[]): Acteur {
  return { personneId: id, habilitations: hs };
}

export const surCellule = (id: (typeof S)[keyof typeof S]): Portee => ({
  sur: "structure",
  id,
  descendants: false,
});

export const surEtSous = (id: (typeof S)[keyof typeof S]): Portee => ({
  sur: "structure",
  id,
  descendants: true,
});

export const surLeMouvement: Portee = { sur: "mouvement" };
