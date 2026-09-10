/**
 * R8 — le temps est explicite.
 *
 * Aucune lecture de l'horloge dans le domaine : l'instant est injecté. Une
 * règle qui dépend de l'heure — et il y en a, puisque tout mandat du GBUM est
 * daté (ADR-005) — se teste alors sans attendre, et sans dépendre du jour où
 * l'on lance les tests.
 *
 * Les instants sont en UTC. L'affichage en Africa/Casablanca appartient à la
 * couche de présentation : le domaine ne connaît pas les fuseaux.
 */

declare const marqueInstant: unique symbol;

/** Millisecondes UTC, marquées pour ne pas se confondre avec un nombre quelconque. */
export type Instant = number & { readonly [marqueInstant]: "Instant" };

export function instant(millisecondesUtc: number): Instant {
  return millisecondesUtc as Instant;
}

export function instantDepuisIso(iso: string): Instant {
  return instant(Date.parse(iso));
}

export interface Horloge {
  maintenant(): Instant;
}

/** L'horloge de production — le seul endroit du domaine qui lit l'heure. */
export const horlogeSysteme: Horloge = {
  maintenant: () => instant(Date.now()),
};

/** L'horloge des tests : elle ne bouge que si on la pousse. */
export function horlogeFigee(a: Instant): Horloge {
  return { maintenant: () => a };
}

/**
 * Une période bornée, fin exclusive.
 *
 * Un mandat qui court jusqu'au 1er septembre s'arrête à l'instant où le
 * 1er septembre commence, et le mandat suivant démarre au même instant. Sans
 * cette convention, il existe une seconde pendant laquelle deux bureaux sont
 * en fonction — ou aucun.
 */
export interface Periode {
  readonly debut: Instant;
  readonly fin: Instant;
}

export function contient(periode: Periode, a: Instant): boolean {
  return a >= periode.debut && a < periode.fin;
}
