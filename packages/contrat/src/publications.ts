import { z } from "zod";

/**
 * Ce que le hub privé publie vers le site public — version 1 du contrat
 * (ADR-014).
 *
 * Le hub privé est le propriétaire des villes et des cellules (C1) ; le site
 * n'en garde qu'une copie. Les objets sont STRICTS : un champ absent d'ici est
 * refusé (C2). C'est ce qui rend ADR-011 vraie à la frontière elle-même — une
 * cellule qui arriverait avec un jour, un lieu ou un responsable ne serait pas
 * lue plus loin : elle serait rejetée ici, et la publication entière avec elle.
 *
 * Le contact du bureau y figure aussi : c'est le hub privé qui le tient, saisi
 * par le responsable de la ville (décision du 29/09/2026). C'est le seul
 * contact publié (ADR-011) ; le site décide seul de l'afficher ou non selon
 * les dates du mandat.
 */

export const CellulePubliee = z.strictObject({
  nom: z.string().min(1).max(140),
  /** Absent quand la cellule n'a pas encore d'effectif connu. */
  nombreDeMembres: z.number().int().min(0).nullable(),
});

/**
 * Le bureau d'une ville est renouvelé chaque année : son adresse ne vaut que
 * pour son mandat. Les dates sont des jours (AAAA-MM-JJ), comme on les saisit.
 */
export const BureauPublie = z.strictObject({
  courriel: z.email().max(200),
  mandatDebut: z.iso.date(),
  mandatFin: z.iso.date(),
});

export const VillePubliee = z.strictObject({
  nom: z.string().min(1).max(140),
  /** L'ordre dans lequel le mouvement cite ses villes. */
  rang: z.number().int().min(0),
  /** Absent tant que la ville n'a pas donné l'adresse de son bureau. */
  bureau: BureauPublie.nullable(),
  cellules: z.array(CellulePubliee),
});

export const Publications = z.strictObject({
  version: z.literal("1"),
  /** L'instant où le hub privé a composé la publication (ISO 8601, UTC). */
  emisLe: z.iso.datetime(),
  villes: z.array(VillePubliee),
});

export type Publications = z.infer<typeof Publications>;
