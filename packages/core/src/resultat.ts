/**
 * Le type de retour de tout ce qui peut échouer.
 *
 * R2 — aucune erreur n'est avalée. Une fonction qui peut échouer le dit dans
 * son type ; l'appelant ne peut pas l'ignorer sans que le compilateur le voie.
 * R3 — les états impossibles sont impossibles : il n'existe pas de résultat
 * qui soit à la fois réussi et en erreur, ni de résultat sans valeur ni cause.
 */
export type Resultat<T, E> =
  | { readonly ok: true; readonly valeur: T }
  | { readonly ok: false; readonly erreur: E };

export function reussite<T>(valeur: T): Resultat<T, never> {
  return { ok: true, valeur };
}

export function echec<E>(erreur: E): Resultat<never, E> {
  return { ok: false, erreur };
}
