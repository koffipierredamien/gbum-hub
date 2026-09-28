import type { StructureId } from "../partage/identifiants.js";
import type { Structure } from "./types.js";

/**
 * L'arbre des structures, réduit à la seule question que pose le contrôle
 * d'accès : cette structure est-elle sous celle-là ?
 *
 * Le domaine ne connaît pas la base : on lui passe un arbre, il ne va pas le
 * chercher. C'est ce qui rend une règle du GBUM testable en mémoire, en
 * millisecondes.
 */
export interface Arbre {
  readonly parentDe: (id: StructureId) => StructureId | null;
}

export function arbreDepuis(structures: readonly Structure[]): Arbre {
  const parents = new Map<StructureId, StructureId | null>();
  for (const s of structures) parents.set(s.id, s.parentId);
  return { parentDe: (id) => parents.get(id) ?? null };
}

/** Profondeur maximale explorée — garde-fou contre un cycle en base. */
const PROFONDEUR_MAX = 32;

export function estDescendant(arbre: Arbre, enfant: StructureId, ancetre: StructureId): boolean {
  let courant: StructureId | null = arbre.parentDe(enfant);
  for (let i = 0; courant !== null && i < PROFONDEUR_MAX; i += 1) {
    if (courant === ancetre) return true;
    courant = arbre.parentDe(courant);
  }
  return false;
}
