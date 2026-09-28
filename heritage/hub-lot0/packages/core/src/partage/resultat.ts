/**
 * Résultat : un succès ou un échec typé, jamais une exception avalée.
 *
 * L'application actuelle compte 57 blocs `except …: pass`. Une base
 * indisponible, une faute de frappe et un vrai refus d'accès y deviennent
 * indiscernables — le code le constate lui-même : « le filtre par ville de
 * l'annuaire disparaissait en silence, avalé par son try/except ».
 *
 * Ici l'échec est une valeur : l'appelant ne peut pas l'ignorer sans que le
 * compilateur le lui dise.
 */
export type Resultat<T, E> =
  | { readonly ok: true; readonly valeur: T }
  | { readonly ok: false; readonly erreur: E };

export const succes = <T>(valeur: T): Resultat<T, never> => ({ ok: true, valeur });
export const echec = <E>(erreur: E): Resultat<never, E> => ({ ok: false, erreur });
