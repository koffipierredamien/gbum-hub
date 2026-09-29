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
 * Le contact du bureau n'y figure pas : le hub privé ne tient pas, aujourd'hui,
 * d'adresse de bureau par ville (29/09/2026). Il reste saisi sur le site tant
 * que ce n'est pas le cas — plutôt que d'inventer un champ qu'aucune source ne
 * remplit.
 */

export const CellulePubliee = z.strictObject({
  nom: z.string().min(1).max(140),
  /** Absent quand la cellule n'a pas encore d'effectif connu. */
  nombreDeMembres: z.number().int().min(0).nullable(),
});

export const VillePubliee = z.strictObject({
  nom: z.string().min(1).max(140),
  /** L'ordre dans lequel le mouvement cite ses villes. */
  rang: z.number().int().min(0),
  cellules: z.array(CellulePubliee),
});

export const Publications = z.strictObject({
  version: z.literal("1"),
  /** L'instant où le hub privé a composé la publication (ISO 8601, UTC). */
  emisLe: z.iso.datetime(),
  villes: z.array(VillePubliee),
});

export type Publications = z.infer<typeof Publications>;
