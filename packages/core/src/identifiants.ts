/**
 * Les identifiants sont typés, pas de simples chaînes.
 *
 * Sans cela, `deplacer(celluleId, villeId)` et `deplacer(villeId, celluleId)`
 * compilent tous les deux, et l'un des deux est un incident. La marque n'existe
 * qu'à la compilation : à l'exécution, ce sont des chaînes, sans un octet de
 * plus.
 */
declare const marque: unique symbol;

type Marque<T, Nom extends string> = T & { readonly [marque]: Nom };

export type VilleId = Marque<string, "VilleId">;
export type CelluleId = Marque<string, "CelluleId">;
export type PersonneId = Marque<string, "PersonneId">;

export function villeId(valeur: string): VilleId {
  return valeur as VilleId;
}

export function celluleId(valeur: string): CelluleId {
  return valeur as CelluleId;
}

export function personneId(valeur: string): PersonneId {
  return valeur as PersonneId;
}
